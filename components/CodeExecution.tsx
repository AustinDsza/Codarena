"use client"

import { useState } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import { Play, Loader2, CheckCircle, XCircle, Clock, Cpu } from "lucide-react"
import { judge0Service, Judge0Submission } from "@/lib/judge0-service"

interface CodeExecutionProps {
  code: string
  language: string
  testCases?: Array<{
    input: string
    expectedOutput: string
    description?: string
  }>
  onExecutionComplete?: (result: any) => void
}

export function CodeExecution({ 
  code, 
  language, 
  testCases = [], 
  onExecutionComplete 
}: CodeExecutionProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [currentTestCase, setCurrentTestCase] = useState<number | null>(null)

  const handleRunCode = async () => {
    if (!code.trim()) {
      alert('Please write some code first')
      return
    }

    setIsExecuting(true)
    setExecutionResult(null)
    setCurrentTestCase(null)

    try {
      // If there are test cases, run them one by one
      if (testCases.length > 0) {
        const results = []
        
        for (let i = 0; i < testCases.length; i++) {
          setCurrentTestCase(i)
          
          const submission: Judge0Submission = {
            language,
            source_code: code,
            stdin: testCases[i].input,
            expected_output: testCases[i].expectedOutput,
            cpu_time_limit: '2.0',
            memory_limit: '128000'
          }

          const result = await judge0Service.executeCode(submission)
          const formattedResult = judge0Service.formatResult(result)
          
          results.push({
            testCase: i + 1,
            input: testCases[i].input,
            expectedOutput: testCases[i].expectedOutput,
            actualOutput: formattedResult.output,
            isPassed: formattedResult.isSuccess && 
                     formattedResult.output.trim() === testCases[i].expectedOutput.trim(),
            time: formattedResult.time,
            memory: formattedResult.memory,
            error: formattedResult.error,
            status: formattedResult.status
          })
        }

        setExecutionResult({
          type: 'test_cases',
          results,
          totalTests: testCases.length,
          passedTests: results.filter(r => r.isPassed).length
        })
      } else {
        // Run code without test cases
        const submission: Judge0Submission = {
          language,
          source_code: code,
          stdin: '',
          cpu_time_limit: '2.0',
          memory_limit: '128000'
        }

        const result = await judge0Service.executeCode(submission)
        const formattedResult = judge0Service.formatResult(result)
        
        setExecutionResult({
          type: 'simple',
          output: formattedResult.output,
          error: formattedResult.error,
          time: formattedResult.time,
          memory: formattedResult.memory,
          status: formattedResult.status,
          isSuccess: formattedResult.isSuccess
        })
      }

      onExecutionComplete?.(executionResult)
    } catch (error) {
      console.error('Code execution error:', error)
      setExecutionResult({
        type: 'error',
        error: 'Failed to execute code. Please try again.'
      })
    } finally {
      setIsExecuting(false)
      setCurrentTestCase(null)
    }
  }

  const getStatusIcon = (isPassed: boolean) => {
    if (isPassed) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getStatusColor = (isPassed: boolean) => {
    return isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-4">
      {/* Run Button */}
      <div className="flex items-center gap-3">
        <MaterialButton
          onClick={handleRunCode}
          disabled={isExecuting}
          startIcon={isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isExecuting ? 'Running...' : 'Run Code'}
        </MaterialButton>
        
        {isExecuting && currentTestCase !== null && (
          <MaterialBadge variant="default" size="small" className="bg-blue-100 text-blue-800">
            Test Case {currentTestCase + 1} of {testCases.length}
          </MaterialBadge>
        )}
      </div>

      {/* Execution Results */}
      {executionResult && (
        <MaterialCard elevation={2} className="p-4">
          {executionResult.type === 'test_cases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Test Results</h3>
                <MaterialBadge 
                  variant="default" 
                  size="medium" 
                  className={executionResult.passedTests === executionResult.totalTests ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {executionResult.passedTests}/{executionResult.totalTests} Passed
                </MaterialBadge>
              </div>

              <div className="space-y-3">
                {executionResult.results.map((result: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Test Case {result.testCase}</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.isPassed)}
                        <MaterialBadge 
                          variant="default" 
                          size="small" 
                          className={getStatusColor(result.isPassed)}
                        >
                          {result.isPassed ? 'PASSED' : 'FAILED'}
                        </MaterialBadge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Input:</span>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                          {result.input}
                        </pre>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Expected:</span>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                          {result.expectedOutput}
                        </pre>
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="font-medium text-gray-600">Output:</span>
                      <pre className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                        {result.actualOutput || 'No output'}
                      </pre>
                    </div>

                    {result.error && (
                      <div className="mt-2">
                        <span className="font-medium text-red-600">Error:</span>
                        <pre className="mt-1 p-2 bg-red-50 rounded text-xs font-mono text-red-700">
                          {result.error}
                        </pre>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {result.time}s
                      </div>
                      <div className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        {result.memory}KB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {executionResult.type === 'simple' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Execution Result</h3>
                <MaterialBadge 
                  variant="default" 
                  size="medium" 
                  className={executionResult.isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {executionResult.status}
                </MaterialBadge>
              </div>

              {executionResult.output && (
                <div>
                  <span className="font-medium text-gray-600">Output:</span>
                  <pre className="mt-1 p-3 bg-gray-50 rounded text-sm font-mono">
                    {executionResult.output}
                  </pre>
                </div>
              )}

              {executionResult.error && (
                <div>
                  <span className="font-medium text-red-600">Error:</span>
                  <pre className="mt-1 p-3 bg-red-50 rounded text-sm font-mono text-red-700">
                    {executionResult.error}
                  </pre>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {executionResult.time}s
                </div>
                <div className="flex items-center gap-1">
                  <Cpu className="h-4 w-4" />
                  {executionResult.memory}KB
                </div>
              </div>
            </div>
          )}

          {executionResult.type === 'error' && (
            <div className="text-center py-4">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 font-medium">{executionResult.error}</p>
              {executionResult.fallback && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Setup Required</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    To enable code execution, you need to configure the Judge0 API key.
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>1. Get API key from <a href="https://rapidapi.com/judge0-official/api/judge0-ce/" target="_blank" rel="noopener noreferrer" className="underline">RapidAPI Judge0</a></p>
                    <p>2. Add to your .env.local file:</p>
                    <code className="block bg-blue-100 p-2 rounded mt-1">JUDGE0_API_KEY=your_api_key_here</code>
                    <p>3. Restart the development server</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </MaterialCard>
      )}
    </div>
  )
}
