import { NextRequest, NextResponse } from 'next/server'

// Judge0 API configuration
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || ''

interface Judge0Submission {
  language_id: number
  source_code: string
  stdin?: string
  expected_output?: string
  cpu_time_limit?: string
  memory_limit?: string
}

interface Judge0Response {
  token: string
}

// Language ID mapping for common languages
const LANGUAGE_IDS = {
  'python': 71,      // Python 3
  'javascript': 63,  // Node.js
  'java': 62,        // Java
  'cpp': 54,         // C++ (GCC 9.2.0)
  'c': 50,           // C (GCC 9.2.0)
  'csharp': 51,      // C# (Mono 6.6.0.161)
  'go': 60,          // Go
  'rust': 73,        // Rust
  'php': 68,         // PHP
  'ruby': 72,        // Ruby
  'swift': 83,       // Swift
  'kotlin': 78,      // Kotlin
  'scala': 81,       // Scala
  'typescript': 74,  // TypeScript
} as const

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      language, 
      source_code, 
      stdin = '', 
      expected_output = '',
      cpu_time_limit = '2.0',
      memory_limit = '128000'
    } = body

    // Validate required fields
    if (!language || !source_code) {
      return NextResponse.json(
        { error: 'Language and source code are required' },
        { status: 400 }
      )
    }

    // Get language ID
    const languageId = LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS]
    if (!languageId) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      )
    }

    // Prepare submission data (use base64 to avoid UTF-8 conversion issues in Judge0)
    const toBase64 = (value: string) => Buffer.from(value ?? '', 'utf8').toString('base64')

    const submission: Judge0Submission = {
      language_id: languageId,
      // Encode fields to base64 (Judge0 recommends base64 for arbitrary content)
      source_code: toBase64(source_code),
      stdin: toBase64(stdin),
      expected_output: expected_output ? toBase64(expected_output) : undefined,
      cpu_time_limit,
      memory_limit,
    }

    // Check if API key is configured
    if (!JUDGE0_API_KEY || JUDGE0_API_KEY === '') {
      return NextResponse.json(
        { 
          error: 'Judge0 API key not configured. Please set JUDGE0_API_KEY in your environment variables.',
          fallback: true 
        },
        { status: 400 }
      )
    }

    // Submit to Judge0 (with base64_encoded flag)
    const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify(submission),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Judge0 API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to submit code to Judge0 API' },
        { status: response.status }
      )
    }

    const result: Judge0Response = await response.json()

    return NextResponse.json({
      success: true,
      token: result.token,
      message: 'Code submitted successfully'
    })

  } catch (error) {
    console.error('Judge0 submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
