import { NextRequest, NextResponse } from 'next/server'

// Judge0 API configuration
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || ''

interface Judge0Result {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  message: string | null
  time: string | null
  memory: string | null
  status: {
    id: number
    description: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Get result from Judge0 (request base64-encoded outputs)
    const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Judge0 API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to get result from Judge0 API' },
        { status: response.status }
      )
    }

    const result: Judge0Result = await response.json()

    // Check if result is ready
    if (result.status.id <= 2) {
      // Status 1: In Queue, Status 2: Processing
      return NextResponse.json({
        success: true,
        status: 'processing',
        message: 'Code is still being processed',
        status_description: result.status.description
      })
    }

    // Result is ready - decode base64 fields
    const fromBase64 = (val: string | null) => (val ? Buffer.from(val, 'base64').toString('utf8') : null)

    return NextResponse.json({
      success: true,
      status: 'completed',
      result: {
        stdout: fromBase64(result.stdout),
        stderr: fromBase64(result.stderr),
        compile_output: fromBase64(result.compile_output),
        message: fromBase64(result.message),
        time: result.time,
        memory: result.memory,
        status: result.status
      }
    })

  } catch (error) {
    console.error('Judge0 result error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
