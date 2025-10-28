// Judge0 API Service for Code Execution
export interface Judge0Submission {
  language: string
  source_code: string
  stdin?: string
  expected_output?: string
  cpu_time_limit?: string
  memory_limit?: string
}

export interface Judge0Result {
  success: boolean
  status: 'processing' | 'completed' | 'error'
  result?: {
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
  message?: string
  status_description?: string
}

export interface Judge0Language {
  id: number
  name: string
}

class Judge0Service {
  private baseUrl = '/api/judge0'

  // Submit code for execution
  async submitCode(submission: Judge0Submission): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to submit code'
        }
      }

      return {
        success: true,
        token: data.token
      }
    } catch (error) {
      console.error('Judge0 submission error:', error)
      return {
        success: false,
        error: 'Network error while submitting code'
      }
    }
  }

  // Get execution result
  async getResult(token: string): Promise<Judge0Result> {
    try {
      const response = await fetch(`${this.baseUrl}/result?token=${token}`)
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          status: 'error',
          message: data.error || 'Failed to get result'
        }
      }

      return data
    } catch (error) {
      console.error('Judge0 result error:', error)
      return {
        success: false,
        status: 'error',
        message: 'Network error while getting result'
      }
    }
  }

  // Get supported languages
  async getLanguages(): Promise<{ success: boolean; languages?: Judge0Language[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`)
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get languages'
        }
      }

      return {
        success: true,
        languages: data.languages
      }
    } catch (error) {
      console.error('Judge0 languages error:', error)
      return {
        success: false,
        error: 'Network error while getting languages'
      }
    }
  }

  // Poll for result until completion
  async pollResult(token: string, maxAttempts: number = 30, interval: number = 1000): Promise<Judge0Result> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await this.getResult(token)
      
      if (result.status === 'completed' || result.status === 'error') {
        return result
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval))
    }

    return {
      success: false,
      status: 'error',
      message: 'Timeout waiting for result'
    }
  }

  // Execute code with automatic polling
  async executeCode(submission: Judge0Submission): Promise<Judge0Result> {
    const submitResult = await this.submitCode(submission)
    
    if (!submitResult.success || !submitResult.token) {
      return {
        success: false,
        status: 'error',
        message: submitResult.error || 'Failed to submit code'
      }
    }

    return await this.pollResult(submitResult.token)
  }

  // Get language ID from language name
  getLanguageId(language: string): number {
    const languageMap: { [key: string]: number } = {
      'python': 71,
      'javascript': 63,
      'java': 62,
      'cpp': 54,
      'c': 50,
      'csharp': 51,
      'go': 60,
      'rust': 73,
      'php': 68,
      'ruby': 72,
      'swift': 83,
      'kotlin': 78,
      'scala': 81,
      'typescript': 74,
    }

    return languageMap[language.toLowerCase()] || 71 // Default to Python
  }

  // Format execution result for display
  formatResult(result: Judge0Result): {
    status: string
    output: string
    error: string
    time: string
    memory: string
    isSuccess: boolean
  } {
    if (!result.success || result.status === 'error') {
      return {
        status: 'Error',
        output: '',
        error: result.message || 'Unknown error',
        time: '0.000',
        memory: '0',
        isSuccess: false
      }
    }

    if (result.status === 'processing') {
      return {
        status: 'Processing',
        output: 'Code is being executed...',
        error: '',
        time: '0.000',
        memory: '0',
        isSuccess: false
      }
    }

    const execResult = result.result!
    const isSuccess = execResult.status.id === 3 // Accepted

    return {
      status: execResult.status.description,
      output: execResult.stdout || execResult.compile_output || '',
      error: execResult.stderr || execResult.message || '',
      time: execResult.time || '0.000',
      memory: execResult.memory || '0',
      isSuccess
    }
  }
}

// Export singleton instance
export const judge0Service = new Judge0Service()
