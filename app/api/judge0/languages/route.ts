import { NextRequest, NextResponse } from 'next/server'

// Judge0 API configuration
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || ''

interface Judge0Language {
  id: number
  name: string
}

export async function GET(request: NextRequest) {
  try {
    // Get languages from Judge0
    const response = await fetch(`${JUDGE0_API_URL}/languages`, {
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
        { error: 'Failed to get languages from Judge0 API' },
        { status: response.status }
      )
    }

    const languages: Judge0Language[] = await response.json()

    // Filter to only include languages we support
    const supportedLanguages = [
      { id: 71, name: 'Python 3' },
      { id: 63, name: 'Node.js' },
      { id: 62, name: 'Java' },
      { id: 54, name: 'C++ (GCC 9.2.0)' },
      { id: 50, name: 'C (GCC 9.2.0)' },
      { id: 51, name: 'C# (Mono 6.6.0.161)' },
      { id: 60, name: 'Go' },
      { id: 73, name: 'Rust' },
      { id: 68, name: 'PHP' },
      { id: 72, name: 'Ruby' },
      { id: 83, name: 'Swift' },
      { id: 78, name: 'Kotlin' },
      { id: 81, name: 'Scala' },
      { id: 74, name: 'TypeScript' },
    ]

    return NextResponse.json({
      success: true,
      languages: supportedLanguages
    })

  } catch (error) {
    console.error('Judge0 languages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
