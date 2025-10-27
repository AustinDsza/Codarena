"use client"

import { useState, useEffect, useRef } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import {
  Code2,
  Timer,
  Send,
  Play,
  Save,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Eye,
  EyeOff,
  Lightbulb,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { contestMonitoring } from "@/lib/contest-monitoring"
import {
  FullscreenWarningDialog,
  FaceDetectionWarningDialog,
  VoiceDetectionWarningDialog,
  MonitoringStatus,
} from "./components/MonitoringComponents"

// Mock contest data - in real app, this would come from API
const getContestById = (id: string) => {
  const contests = {
    "live-dsa-urgent": {
      id: "live-dsa-urgent",
      title: "🔥 Lightning DSA Challenge",
      description: "Quick-fire coding challenge starting any moment! Perfect for testing your speed and accuracy.",
      type: "dsa",
      category: "small-league",
      creator: "Speed Coders",
      participants: 21,
      maxParticipants: 25,
      prizePool: 1900,
      totalCollected: 2000,
      platformFee: 100,
      entryFee: 80,
      prizeType: "cash",
      difficulty: "intermediate",
      duration: "45 minutes",
      startTime: new Date(Date.now() + 1.5 * 60 * 1000), // 1.5 minutes from now
      tags: ["Lightning Round", "Quick", "High Stakes"],
      featured: true,
      isLive: true,
      showTimer: true,
      prizeDistribution: [
        { position: "1st", percentage: 50, amount: 950, count: 1 },
        { position: "2nd", percentage: 30, amount: 570, count: 1 },
        { position: "3rd", percentage: 20, amount: 380, count: 1 },
      ],
      problems: [
        {
          id: 1,
          title: "Array Manipulation",
          difficulty: "Medium",
          points: 200,
          description: "Given an array of integers, find the maximum sum of any contiguous subarray.",
          examples: [
            {
              input: "[−2,1,−3,4,−1,2,1,−5,4]",
              output: "6",
              explanation: "The subarray [4,−1,2,1] has the largest sum = 6.",
            },
          ],
          constraints: ["1 ≤ nums.length ≤ 10^5", "-10^4 ≤ nums[i] ≤ 10^4"],
          hints: ["Think about dynamic programming approach", "Consider Kadane's algorithm for optimal solution"],
        },
        {
          id: 2,
          title: "String Algorithms",
          difficulty: "Medium",
          points: 250,
          description: "Find the longest palindromic substring in a given string.",
          examples: [
            {
              input: '"babad"',
              output: '"bab"',
              explanation: 'Note: "aba" is also a valid answer.',
            },
          ],
          constraints: ["1 ≤ s.length ≤ 1000", "s consists of only digits and English letters"],
          hints: ["Consider expanding around centers", "Dynamic programming can also solve this efficiently"],
        },
        {
          id: 3,
          title: "Graph Traversal",
          difficulty: "Hard",
          points: 300,
          description: "Find the shortest path between two nodes in a weighted graph.",
          examples: [
            {
              input: "graph = [[0,1,4],[1,2,2],[2,3,1]], start = 0, end = 3",
              output: "7",
              explanation: "The shortest path is 0 -> 1 -> 2 -> 3 with total weight 7.",
            },
          ],
          constraints: ["1 ≤ n ≤ 100 (number of nodes)", "0 ≤ weight ≤ 100"],
          hints: ["Dijkstra's algorithm is perfect for this", "Consider using a priority queue for efficiency"],
        },
      ],
      rules: [
        "Contest duration is 45 minutes",
        "3 problems to solve in order of difficulty",
        "Partial scoring available for incomplete solutions",
        "No external resources allowed",
        "Plagiarism will result in disqualification",
      ],
      inviteCode: "LIGHTNING2024",
    },
    "practice-dsa-1": {
      id: "practice-dsa-1",
      title: "🎯 DSA Practice Arena",
      description: "Perfect for beginners! Practice algorithmic problems with zero pressure and instant feedback.",
      type: "dsa",
      category: "practice",
      creator: "Codarena Team",
      participants: 234,
      maxParticipants: 500,
      entryFee: 0,
      prizeType: "free",
      difficulty: "beginner",
      duration: "1 hour",
      startTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      tags: ["Practice", "Free", "Beginner Friendly"],
      featured: true,
      showTimer: true,
      completionRate: 85,
      averageScore: 72,
      learningBenefits: ["Skill Assessment", "Progress Tracking", "Performance Analytics"],
      problems: [
        {
          id: 1,
          title: "Two Sum",
          difficulty: "Easy",
          points: 100,
          description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          examples: [
            {
              input: "nums = [2,7,11,15], target = 9",
              output: "[0,1]",
              explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
            },
          ],
          constraints: ["2 ≤ nums.length ≤ 10^4", "-10^9 ≤ nums[i] ≤ 10^9", "-10^9 ≤ target ≤ 10^9"],
          hints: [
            "Use a hash map to store numbers and their indices",
            "For each number, check if target - number exists in the map",
          ],
        },
        {
          id: 2,
          title: "Valid Parentheses",
          difficulty: "Easy",
          points: 100,
          description:
            "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
          examples: [
            {
              input: 's = "()"',
              output: "true",
              explanation: "The string contains valid parentheses.",
            },
          ],
          constraints: ["1 ≤ s.length ≤ 10^4", "s consists of parentheses only '()[]{}'."],
          hints: ["Use a stack data structure", "Push opening brackets and pop when you find closing brackets"],
        },
        {
          id: 3,
          title: "Merge Two Sorted Lists",
          difficulty: "Easy",
          points: 150,
          description:
            "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted order.",
          examples: [
            {
              input: "list1 = [1,2,4], list2 = [1,3,4]",
              output: "[1,1,2,3,4,4]",
              explanation: "The merged list is sorted.",
            },
          ],
          constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 ≤ Node.val ≤ 100"],
          hints: ["Use two pointers to traverse both lists", "Compare values and add the smaller one to result"],
        },
      ],
      rules: [
        "Practice mode with unlimited time",
        "3 beginner-friendly problems",
        "Hints and solutions available",
        "No time pressure or penalties",
        "Focus on learning and improvement",
      ],
      inviteCode: "PRACTICE2024",
    },
  }

  return contests[id as keyof typeof contests] || null
}

// Code execution simulation
const executeCode = async (code: string, language: string, problemId: number) => {
  // Simulate code execution delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock execution results based on code content and problem
  const hasBasicStructure = code.includes("def ") || code.includes("function") || code.includes("class")
  const hasLogic = code.length > 100 && !code.includes("pass") && !code.includes("// Write your solution here")

  if (!hasBasicStructure) {
    return {
      success: false,
      output: "Error: No function definition found",
      error: "SyntaxError: Expected function definition",
      executionTime: "0ms",
    }
  }

  if (!hasLogic) {
    return {
      success: false,
      output: "Error: Function body is empty or incomplete",
      error: "RuntimeError: Function not implemented",
      executionTime: "0ms",
    }
  }

  // Simulate successful execution with sample outputs
  const sampleOutputs = {
    1: "6\nExecution completed successfully",
    2: '"bab"\nExecution completed successfully',
    3: "7\nExecution completed successfully",
  }

  return {
    success: true,
    output: sampleOutputs[problemId as keyof typeof sampleOutputs] || "Output generated successfully",
    error: null,
    executionTime: `${Math.floor(Math.random() * 200) + 50}ms`,
  }
}

// Submission Result Dialog
function SubmissionResultDialog({
  isOpen,
  onClose,
  result,
}: {
  isOpen: boolean
  onClose: () => void
  result: any
}) {
  if (!result) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {result.status === "accepted" ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : result.status === "wrong_answer" ? (
              <XCircle className="h-6 w-6 text-red-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            )}
            Submission Result
          </DialogTitle>
          <DialogDescription>
            {result.status === "accepted"
              ? "Congratulations! Your solution is correct."
              : result.status === "wrong_answer"
                ? "Your solution produced incorrect output."
                : "Your solution encountered an error."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <MaterialCard
            elevation={1}
            className={`p-4 ${
              result.status === "accepted"
                ? "bg-green-50 border border-green-200"
                : result.status === "wrong_answer"
                  ? "bg-red-50 border border-red-200"
                  : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <div className="text-center">
              <div
                className={`text-lg font-bold ${
                  result.status === "accepted"
                    ? "text-green-700"
                    : result.status === "wrong_answer"
                      ? "text-red-700"
                      : "text-yellow-700"
                }`}
              >
                {result.status === "accepted"
                  ? "Accepted"
                  : result.status === "wrong_answer"
                    ? "Wrong Answer"
                    : "Runtime Error"}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {result.testCasesPassed}/{result.totalTestCases} test cases passed
              </div>
            </div>
          </MaterialCard>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Runtime:</span>
              <span className="font-medium">{result.runtime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Memory:</span>
              <span className="font-medium">{result.memory}MB</span>
            </div>
            {result.status === "accepted" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Points Earned:</span>
                <span className="font-bold text-green-600">+{result.points}</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {result.error && (
            <MaterialCard elevation={1} className="p-3 bg-red-50 border border-red-200">
              <div className="text-sm text-red-800">
                <strong>Error:</strong> {result.error}
              </div>
            </MaterialCard>
          )}

          <MaterialButton onClick={onClose} fullWidth>
            Continue
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Contest Completion Dialog
function ContestCompletionDialog({
  isOpen,
  onClose,
  onViewResults,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onViewResults: () => void
  isLoading: boolean
}) {
  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-600" />
            Contest Completed!
          </DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Processing your results and generating detailed feedback..."
              : "Congratulations! You've successfully completed the contest. View your detailed results and performance analysis."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <MaterialCard elevation={1} className="p-4 bg-blue-50 border border-blue-200">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <div className="text-lg font-bold text-blue-700">Processing Results</div>
                <div className="text-sm text-blue-600 mt-1">Analyzing your code and generating feedback...</div>
              </div>
            </MaterialCard>
          ) : (
            <>
              <MaterialCard elevation={1} className="p-4 bg-green-50 border border-green-200">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700">Results Ready!</div>
                  <div className="text-sm text-green-600 mt-1">
                    Your solutions have been evaluated and detailed feedback is available.
                  </div>
                </div>
              </MaterialCard>

              <div className="flex gap-3">
                <MaterialButton variant="outlined" onClick={onClose} className="flex-1">
                  Stay Here
                </MaterialButton>
                <MaterialButton onClick={onViewResults} className="flex-1">
                  View Results
                </MaterialButton>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ContestEditorPage() {
  const params = useParams()
  const router = useRouter()
  const contestId = params.id as string

  const [contest, setContest] = useState<any>(null)
  const [currentProblem, setCurrentProblem] = useState(0)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const [showSubmissionResult, setShowSubmissionResult] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(45 * 60) // 45 minutes in seconds
  const [userScore, setUserScore] = useState(0)
  const [solvedProblems, setSolvedProblems] = useState<number[]>([])
  const [contestCompleted, setContestCompleted] = useState(false)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [isProcessingResults, setIsProcessingResults] = useState(false)
  const [codeOutput, setCodeOutput] = useState("Ready to run your code...")
  const [executionHistory, setExecutionHistory] = useState<any[]>([])

  // Monitoring state
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false)
  const [showFaceWarning, setShowFaceWarning] = useState(false)
  const [showVoiceWarning, setShowVoiceWarning] = useState(false)
  const [violations, setViolations] = useState({
    fullscreen: 0,
    face: 0,
    voice: 0,
  })
  const [dismissedWarnings, setDismissedWarnings] = useState({
    face: false,
    voice: false,
  })
  const [warningCooldowns, setWarningCooldowns] = useState({
    face: 0,
    voice: 0,
  })

  // Use refs for cooldown tracking to avoid async state issues
  const faceCooldownRef = useRef(0)
  const voiceCooldownRef = useRef(0)

  // Load contest data
  useEffect(() => {
    const contestData = getContestById(contestId)
    setContest(contestData)

    // Load saved code if exists
    const savedCode = localStorage.getItem(`contest_${contestId}_problem_${currentProblem}`)
    if (savedCode) {
      setCode(savedCode)
    } else {
      setCode(getCodeTemplate(language))
    }

    // Start monitoring for DSA contests
    if (contestData?.type === "dsa") {
      startMonitoring()
    }

    // Cleanup monitoring on unmount
    return () => {
      if (isMonitoring) {
        contestMonitoring.stopMonitoring()
        setIsMonitoring(false)
      }
    }
  }, [contestId, currentProblem])

  // Start monitoring system
  const startMonitoring = () => {
    setIsMonitoring(true)
    
    contestMonitoring.startMonitoring({
      onFaceNotDetected: () => {
        const now = Date.now()
        if (faceCooldownRef.current > 0 && now - faceCooldownRef.current < 15000) {
          return // Still in cooldown period
        }
        setViolations(prev => ({ ...prev, face: prev.face + 1 }))
        setShowFaceWarning(true)
      },
      onVoiceDetected: () => {
        const now = Date.now()
        if (voiceCooldownRef.current > 0 && now - voiceCooldownRef.current < 15000) {
          return // Still in cooldown period
        }
        setViolations(prev => ({ ...prev, voice: prev.voice + 1 }))
        setShowVoiceWarning(true)
      },
      onFullscreenExit: () => {
        setViolations(prev => ({ ...prev, fullscreen: prev.fullscreen + 1 }))
        setShowFullscreenWarning(true)
      },
    })
  }

  // Handle fullscreen re-entry
  const handleReenterFullscreen = async () => {
    const success = await contestMonitoring.enterFullscreen()
    if (success) {
      setShowFullscreenWarning(false)
    }
  }

  // Handle dismiss warnings with 15-second cooldown
  const handleDismissFaceWarning = () => {
    setShowFaceWarning(false)
    faceCooldownRef.current = Date.now()
    setDismissedWarnings(prev => ({ ...prev, face: true }))
    setWarningCooldowns(prev => ({ ...prev, face: Date.now() }))
  }

  const handleDismissVoiceWarning = () => {
    setShowVoiceWarning(false)
    voiceCooldownRef.current = Date.now()
    setDismissedWarnings(prev => ({ ...prev, voice: true }))
    setWarningCooldowns(prev => ({ ...prev, voice: Date.now() }))
  }

  // Update code template when language changes
  useEffect(() => {
    if (contest) {
      const savedCode = localStorage.getItem(`contest_${contestId}_problem_${currentProblem}`)
      if (!savedCode) {
        setCode(getCodeTemplate(language))
      }
    }
  }, [language, contest, contestId, currentProblem])

  // Timer countdown
  useEffect(() => {
    if (contestCompleted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          // Auto-complete contest when time runs out
          handleContestCompletion()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [contestCompleted])

  const getCodeTemplate = (lang: string) => {
    const templates = {
      python: `def solution():
    # Write your solution here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(result)`,
      javascript: `function solution() {
    // Write your solution here
    
}

// Test your solution
console.log(solution());`,
      java: `public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test your solution
        System.out.println(sol.solution());
    }
    
    public int solution() {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int solution() {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    cout << sol.solution() << endl;
    return 0;
}`,
    }
    return templates[lang as keyof typeof templates] || templates.python
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleRunCode = async () => {
    if (!code.trim()) {
      setCodeOutput("Error: No code to execute")
      return
    }

    setIsRunning(true)
    setCodeOutput("Running your code...")

    try {
      const result = await executeCode(code, language, currentProblem + 1)

      if (result.success) {
        setCodeOutput(
          `✅ Execution successful!\n\nOutput:\n${result.output}\n\nExecution time: ${result.executionTime}`,
        )
      } else {
        setCodeOutput(`❌ Execution failed!\n\nError:\n${result.error}\n\nOutput:\n${result.output}`)
      }

      // Add to execution history
      setExecutionHistory((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          success: result.success,
          output: result.output,
          error: result.error,
          executionTime: result.executionTime,
        },
      ])
    } catch (error) {
      setCodeOutput(`❌ Execution failed!\n\nError: ${error}\n\nPlease check your code and try again.`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmitCode = async () => {
    setIsSubmitting(true)

    try {
      // Save code before submitting
      handleSaveCode()

      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock result based on code quality
      const hasGoodStructure = code.includes("def ") || code.includes("function") || code.includes("class")
      const hasLogic = code.length > 150 && !code.includes("pass") && !code.includes("// Write your solution here")

      let successRate = 0.3 // Base 30% chance
      if (hasGoodStructure) successRate += 0.3
      if (hasLogic) successRate += 0.4

      const isCorrect = Math.random() < successRate
      const testCasesPassed = isCorrect ? 10 : Math.floor(Math.random() * 7) + 1

      const result = {
        status: isCorrect ? "accepted" : testCasesPassed > 5 ? "partial" : "wrong_answer",
        testCasesPassed,
        totalTestCases: 10,
        runtime: Math.floor(Math.random() * 100) + 50,
        memory: Math.floor(Math.random() * 20) + 10,
        points: isCorrect
          ? contest.problems[currentProblem].points
          : Math.floor(contest.problems[currentProblem].points * (testCasesPassed / 10)),
        error: !isCorrect ? "Expected output does not match actual output for some test cases" : null,
      }

      setSubmissionResult(result)
      setShowSubmissionResult(true)

      if (result.status === "accepted") {
        setUserScore((prev) => prev + result.points)
        setSolvedProblems((prev) => [...prev, currentProblem])
      } else if (result.status === "partial") {
        setUserScore((prev) => prev + result.points)
      }
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveCode = () => {
    // Save code to local storage
    localStorage.setItem(`contest_${contestId}_problem_${currentProblem}`, code)
    console.log("Code saved successfully")
  }

  const handleResetCode = () => {
    setCode(getCodeTemplate(language))
    setCodeOutput("Ready to run your code...")
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleContestCompletion = async () => {
    setContestCompleted(true)
    setShowCompletionDialog(true)
    setIsProcessingResults(true)

    // Save final code
    handleSaveCode()

    // Simulate result processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessingResults(false)
  }

  const handleViewResults = () => {
    // Store contest session data for results page
    const sessionData = {
      contestId,
      userScore,
      solvedProblems,
      timeSpent: formatTime((contest?.duration === "45 minutes" ? 45 * 60 : 60 * 60) - timeRemaining),
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem(`contest_session_${contestId}`, JSON.stringify(sessionData))

    router.push(`/contest/${contestId}/results`)
  }

  const handleFinishContest = () => {
    // Stop monitoring when contest finishes
    if (isMonitoring) {
      contestMonitoring.stopMonitoring()
      setIsMonitoring(false)
    }
    handleContestCompletion()
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contest...</p>
        </div>
      </div>
    )
  }

  const problem = contest.problems[currentProblem]
  const isTimeRunningOut = timeRemaining <= 300 // 5 minutes or less

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"} bg-gray-50`}>
      {/* Monitoring Status */}
      <MonitoringStatus isMonitoring={isMonitoring} violations={violations} />

      {/* Warning Dialogs */}
      <FullscreenWarningDialog
        isOpen={showFullscreenWarning}
        onClose={() => setShowFullscreenWarning(false)}
        onReenterFullscreen={handleReenterFullscreen}
      />
      
      <FaceDetectionWarningDialog
        isOpen={showFaceWarning}
        onClose={() => setShowFaceWarning(false)}
        onDismiss={handleDismissFaceWarning}
      />
      
      <VoiceDetectionWarningDialog
        isOpen={showVoiceWarning}
        onClose={() => setShowVoiceWarning(false)}
        onDismiss={handleDismissVoiceWarning}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {!isFullscreen && (
                <Link href={`/contest/${contest.id}/lobby`}>
                  <MaterialButton variant="text" size="medium" startIcon={<ArrowLeft className="h-4 w-4" />}>
                    Back to Lobby
                  </MaterialButton>
                </Link>
              )}
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{contest.title}</span>
                  <div className="text-sm text-gray-500">
                    Problem {currentProblem + 1} of {contest.problems.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <MaterialCard
                elevation={1}
                className={`px-4 py-2 ${
                  isTimeRunningOut ? "bg-red-50 border border-red-200" : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Timer className={`h-4 w-4 ${isTimeRunningOut ? "text-red-600" : "text-blue-600"}`} />
                  <span className={`font-mono font-bold ${isTimeRunningOut ? "text-red-700" : "text-blue-700"}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </MaterialCard>

              {/* Score */}
              <MaterialCard elevation={1} className="px-4 py-2 bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-700">{userScore} pts</span>
                </div>
              </MaterialCard>

              {/* Finish Contest Button */}
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={handleFinishContest}
                disabled={contestCompleted}
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Finish Contest
              </MaterialButton>

              {/* Fullscreen Toggle */}
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={toggleFullscreen}
                startIcon={isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              >
                {isFullscreen ? "Exit" : "Fullscreen"}
              </MaterialButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Problem Navigation */}
            <div className="flex items-center gap-2 mb-6">
              {contest.problems.map((prob: any, index: number) => (
                <MaterialButton
                  key={index}
                  variant={currentProblem === index ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setCurrentProblem(index)}
                  className={`${solvedProblems.includes(index) ? "bg-green-100 border-green-300 text-green-800" : ""}`}
                  startIcon={solvedProblems.includes(index) ? <CheckCircle className="h-3 w-3" /> : undefined}
                >
                  {index + 1}
                </MaterialButton>
              ))}
            </div>

            {/* Problem Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
                <MaterialBadge
                  variant="default"
                  size="medium"
                  className={
                    problem.difficulty === "Easy"
                      ? "bg-green-100 text-green-800"
                      : problem.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {problem.difficulty}
                </MaterialBadge>
                <MaterialBadge variant="default" size="medium" className="bg-blue-100 text-blue-800">
                  {problem.points} pts
                </MaterialBadge>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem Description</h3>
                <p className="text-gray-700 leading-relaxed">{problem.description}</p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                {problem.examples.map((example: any, index: number) => (
                  <MaterialCard key={index} elevation={1} className="p-4 mb-4 bg-gray-50">
                    <div className="space-y-2">
                      <div>
                        <strong className="text-gray-900">Input:</strong>
                        <code className="ml-2 px-2 py-1 bg-gray-200 rounded text-sm font-mono">{example.input}</code>
                      </div>
                      <div>
                        <strong className="text-gray-900">Output:</strong>
                        <code className="ml-2 px-2 py-1 bg-gray-200 rounded text-sm font-mono">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div>
                          <strong className="text-gray-900">Explanation:</strong>
                          <span className="ml-2 text-gray-700">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  </MaterialCard>
                ))}
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                <ul className="space-y-1">
                  {problem.constraints.map((constraint: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      • {constraint}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hints */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Hints</h3>
                  <MaterialButton
                    variant="outlined"
                    size="small"
                    onClick={() => setShowHints(!showHints)}
                    startIcon={showHints ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  >
                    {showHints ? "Hide" : "Show"} Hints
                  </MaterialButton>
                </div>
                {showHints && (
                  <div className="space-y-2">
                    {problem.hints.map((hint: string, index: number) => (
                      <MaterialCard key={index} elevation={1} className="p-3 bg-yellow-50 border border-yellow-200">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <span className="text-yellow-800 text-sm">{hint}</span>
                        </div>
                      </MaterialCard>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Editor Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Code Editor</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white z-10 relative"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>

            {/* Editor Actions */}
            <div className="flex items-center gap-2">
              <MaterialButton
                variant="outlined"
                size="small"
                onClick={handleRunCode}
                disabled={isRunning}
                startIcon={
                  isRunning ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )
                }
              >
                {isRunning ? "Running..." : "Run"}
              </MaterialButton>
              <MaterialButton
                variant="contained"
                size="small"
                onClick={handleSubmitCode}
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )
                }
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </MaterialButton>
              <MaterialButton
                variant="outlined"
                size="small"
                onClick={handleSaveCode}
                startIcon={<Save className="h-4 w-4" />}
              >
                Save
              </MaterialButton>
              <MaterialButton
                variant="outlined"
                size="small"
                onClick={handleResetCode}
                startIcon={<RotateCcw className="h-4 w-4" />}
              >
                Reset
              </MaterialButton>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full font-mono text-sm border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your solution here..."
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Output</h3>
            <div className="bg-black text-green-400 font-mono text-sm p-3 rounded-md min-h-[100px] max-h-[200px] overflow-y-auto whitespace-pre-wrap">
              {codeOutput}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Result Dialog */}
      <SubmissionResultDialog
        isOpen={showSubmissionResult}
        onClose={() => setShowSubmissionResult(false)}
        result={submissionResult}
      />

      {/* Contest Completion Dialog */}
      <ContestCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => !isProcessingResults && setShowCompletionDialog(false)}
        onViewResults={handleViewResults}
        isLoading={isProcessingResults}
      />
    </div>
  )
}
