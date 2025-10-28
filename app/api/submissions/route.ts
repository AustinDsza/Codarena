import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { judge0Service } from '@/lib/judge0-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      contest_id,
      problem_id,
      code,
      language,
      user_id
    } = body

    // Validate required fields
    if (!contest_id || !problem_id || !code || !language || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get problem details for test cases
    const { data: problem, error: problemError } = await supabase
      .from('problems')
      .select('test_cases')
      .eq('id', problem_id)
      .single()

    if (problemError || !problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    // Execute code with Judge0
    const testCases = problem.test_cases || []
    let executionResult

    if (testCases.length > 0) {
      // Run with test cases
      const results = []
      let totalScore = 0
      let totalTestCases = testCases.length
      let passedTestCases = 0

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i]
        const submission = {
          language,
          source_code: code,
          stdin: testCase.input,
          expected_output: testCase.expectedOutput,
          cpu_time_limit: '2.0',
          memory_limit: '128000'
        }

        const result = await judge0Service.executeCode(submission)
        const formattedResult = judge0Service.formatResult(result)
        
        const isPassed = formattedResult.isSuccess && 
          formattedResult.output.trim() === testCase.expectedOutput.trim()
        
        if (isPassed) {
          passedTestCases++
          totalScore += testCase.points || 10 // Default points per test case
        }

        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: formattedResult.output,
          isPassed,
          time: formattedResult.time,
          memory: formattedResult.memory,
          error: formattedResult.error,
          status: formattedResult.status
        })
      }

      executionResult = {
        type: 'test_cases',
        results,
        totalTestCases,
        passedTestCases,
        score: totalScore,
        status: passedTestCases === totalTestCases ? 'accepted' : 'wrong_answer'
      }
    } else {
      // Run without test cases
      const submission = {
        language,
        source_code: code,
        stdin: '',
        cpu_time_limit: '2.0',
        memory_limit: '128000'
      }

      const result = await judge0Service.executeCode(submission)
      const formattedResult = judge0Service.formatResult(result)
      
      executionResult = {
        type: 'simple',
        output: formattedResult.output,
        error: formattedResult.error,
        time: formattedResult.time,
        memory: formattedResult.memory,
        status: formattedResult.isSuccess ? 'accepted' : 'runtime_error',
        score: formattedResult.isSuccess ? 10 : 0
      }
    }

    // Save submission to database
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        user_id,
        contest_id,
        problem_id,
        code,
        language,
        status: executionResult.status,
        score: executionResult.score || 0,
        execution_time: parseFloat(executionResult.time || '0'),
        memory_used: parseInt(executionResult.memory || '0'),
        test_cases_passed: executionResult.passedTestCases || 0,
        total_test_cases: executionResult.totalTestCases || 0,
      })
      .select()
      .single()

    if (submissionError) {
      console.error('Error saving submission:', submissionError)
      return NextResponse.json(
        { error: 'Failed to save submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      submission,
      executionResult
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const contest_id = searchParams.get('contest_id')
    const problem_id = searchParams.get('problem_id')

    let query = supabase
      .from('submissions')
      .select(`
        *,
        user:users!submissions_user_id_fkey(name),
        contest:contests!submissions_contest_id_fkey(title),
        problem:problems!submissions_problem_id_fkey(title)
      `)
      .order('created_at', { ascending: false })

    if (user_id) {
      query = query.eq('user_id', user_id)
    }
    if (contest_id) {
      query = query.eq('contest_id', contest_id)
    }
    if (problem_id) {
      query = query.eq('problem_id', problem_id)
    }

    const { data: submissions, error } = await query

    if (error) {
      console.error('Error fetching submissions:', error)
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
    }

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Submissions API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
