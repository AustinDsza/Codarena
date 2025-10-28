import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const live = searchParams.get('live')

    let query = supabase
      .from('contests')
      .select(`
        *,
        creator:users!contests_creator_id_fkey(name),
        problems(id, title, difficulty, points)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (type) {
      query = query.eq('type', type)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    if (live === 'true') {
      query = query.eq('is_live', true)
    }

    const { data: contests, error } = await query

    if (error) {
      console.error('Error fetching contests:', error)
      return NextResponse.json({ error: 'Failed to fetch contests' }, { status: 500 })
    }

    return NextResponse.json({ contests })
  } catch (error) {
    console.error('Contests API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      type,
      category,
      entry_fee,
      prize_pool,
      max_participants,
      start_time,
      end_time,
      difficulty,
      visibility,
      judging,
      winner_criteria,
      number_of_winners,
      prize_structure,
      new_user_discount,
      battle_mode,
      enable_proctoring,
      copy_paste_tracking,
      tab_switch_detection,
      image_proctoring,
      multi_monitor_detection,
      secure_mode,
      plagiarism_detection,
      coding_languages,
      allowed_submissions,
      evaluation_criteria,
      time_per_question,
      randomize_questions,
      show_results,
      problems
    } = body

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract user ID from Bearer token (for now, using the token as user ID)
    const creator_id = authHeader.replace('Bearer ', '')

    // Create contest
    const { data: contest, error: contestError } = await supabase
      .from('contests')
      .insert({
        title,
        description,
        type,
        category,
        creator_id,
        entry_fee,
        prize_pool,
        max_participants,
        start_time,
        end_time,
        difficulty,
        visibility,
        judging,
        winner_criteria,
        number_of_winners,
        prize_structure,
        new_user_discount,
        battle_mode,
        enable_proctoring,
        copy_paste_tracking,
        tab_switch_detection,
        image_proctoring,
        multi_monitor_detection,
        secure_mode,
        plagiarism_detection,
        coding_languages,
        allowed_submissions,
        evaluation_criteria,
        time_per_question,
        randomize_questions,
        show_results,
        is_live: false,
        is_featured: false,
      })
      .select()
      .single()

    if (contestError) {
      console.error('Error creating contest:', contestError)
      return NextResponse.json({ error: 'Failed to create contest' }, { status: 500 })
    }

    // Create problems
    if (problems && problems.length > 0) {
      const problemsData = problems.map((problem: any) => ({
        contest_id: contest.id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        points: problem.points || 100,
        constraints: problem.constraints || '',
        hints: problem.hints || [],
        test_cases: problem.test_cases || [],
        type: problem.type || 'dsa',
        options: problem.options || [],
        correct_answer: problem.correct_answer || 0,
        explanation: problem.explanation || '',
        requirements: problem.requirements || [],
        deliverables: problem.deliverables || [],
        evaluation_criteria: problem.evaluation_criteria || '',
      }))

      const { error: problemsError } = await supabase
        .from('problems')
        .insert(problemsData)

      if (problemsError) {
        console.error('Error creating problems:', problemsError)
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ contest }, { status: 201 })
  } catch (error) {
    console.error('Create contest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
