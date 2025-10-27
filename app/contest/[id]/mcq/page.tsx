"use client"

import { useState, useEffect, useRef } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import {
  Brain,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Flag,
  Target,
  Timer,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Play,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Gift,
  TrendingUp,
  Star,
  Coins,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { contestMonitoring } from "@/lib/contest-monitoring"
import {
  FullscreenWarningDialog,
  FaceDetectionWarningDialog,
  VoiceDetectionWarningDialog,
  MonitoringStatus,
} from "./components/MonitoringComponents"

// Function to format Codarena Coins amount
const formatCCAmount = (amount: number): string => {
  return `${amount.toLocaleString("en-IN")} CC`
}

// Mock MCQ data
const getMCQData = (contestId: string) => {
  const mcqData = {
    "practice-logic-1": {
      contestTitle: "🧠 Logic Warm-up Challenge",
      duration: 30 * 60, // 30 minutes in seconds
      prizeStructure: {
        first: 0,
        second: 0,
        third: 0,
        participation: 0,
      },
      questions: [
        {
          id: 1,
          question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
          options: ["40", "42", "44", "46"],
          correctAnswer: 1, // Index of correct answer (42)
          explanation: "The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42",
          difficulty: "Easy",
          points: 100,
          category: "Pattern Recognition",
        },
        {
          id: 2,
          question: "If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely Lazzles.",
          options: ["True", "False", "Cannot be determined", "Insufficient information"],
          correctAnswer: 0, // True
          explanation: "This is a valid logical syllogism. If A→B and B→C, then A→C.",
          difficulty: "Easy",
          points: 100,
          category: "Logical Reasoning",
        },
        {
          id: 3,
          question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
          options: ["0°", "7.5°", "15°", "22.5°"],
          correctAnswer: 1, // 7.5°
          explanation:
            "At 3:15, the minute hand is at 90° and the hour hand is at 97.5° (3×30° + 15×0.5°). The difference is 7.5°.",
          difficulty: "Medium",
          points: 150,
          category: "Mathematical Logic",
        },
        {
          id: 4,
          question: "Which number should replace the question mark in this series: 1, 4, 9, 16, 25, ?",
          options: ["30", "36", "42", "49"],
          correctAnswer: 1, // 36
          explanation: "This is a series of perfect squares: 1², 2², 3², 4², 5², 6² = 36",
          difficulty: "Easy",
          points: 100,
          category: "Pattern Recognition",
        },
        {
          id: 5,
          question: "In a certain code, FLOWER is written as EKNVDQ. How is GARDEN written in that code?",
          options: ["FZQCDM", "FZQCDK", "FZQCDL", "FZQCDN"],
          correctAnswer: 0, // FZQCDM
          explanation: "Each letter is replaced by the letter that comes one position before it in the alphabet.",
          difficulty: "Medium",
          points: 150,
          category: "Coding-Decoding",
        },
      ],
    },
    "high-roller-logic-1": {
      contestTitle: "🧠 Mastermind Elite Series",
      duration: 90 * 60, // 90 minutes in seconds
      prizeStructure: {
        first: 50000,
        second: 25000,
        third: 10000,
        participation: 1000,
      },
      questions: [
        {
          id: 1,
          question:
            "In a group of 100 people, 70 can speak English, 60 can speak French, and 50 can speak both. How many people can speak neither English nor French?",
          options: ["10", "20", "30", "40"],
          correctAnswer: 1, // 20
          explanation:
            "Using set theory: |E ∪ F| = |E| + |F| - |E ∩ F| = 70 + 60 - 50 = 80. So 100 - 80 = 20 people speak neither.",
          difficulty: "Expert",
          points: 400,
          category: "Advanced Logic Puzzles",
        },
        {
          id: 2,
          question: "If P → Q is true and Q → R is true, and R is false, what can we conclude about P?",
          options: ["P is true", "P is false", "P can be either true or false", "Cannot be determined"],
          correctAnswer: 1, // P is false
          explanation: "By modus tollens: If P → Q and Q → R, then P → R. Since R is false and P → R, P must be false.",
          difficulty: "Expert",
          points: 500,
          category: "Mathematical Reasoning",
        },
        {
          id: 3,
          question:
            "A cube is painted red on all faces and then cut into 64 smaller cubes of equal size. How many of the smaller cubes have exactly two red faces?",
          options: ["12", "24", "36", "48"],
          correctAnswer: 1, // 24
          explanation:
            "The cube is 4×4×4. Cubes with exactly 2 red faces are on the edges but not corners. There are 12 edges, each with 2 such cubes, so 12×2 = 24.",
          difficulty: "Expert",
          points: 600,
          category: "Abstract Problem Solving",
        },
      ],
    },
    "beginner-logic-1": {
      contestTitle: "🎓 Logic Builder Challenge",
      duration: 45 * 60, // 45 minutes in seconds
      prizeStructure: {
        first: 2000,
        second: 1000,
        third: 500,
        participation: 100,
      },
      questions: [
        {
          id: 1,
          question: "What is the next number in the pattern: 1, 3, 5, 7, ?",
          options: ["8", "9", "10", "11"],
          correctAnswer: 1, // 9
          explanation: "This is a sequence of odd numbers: 1, 3, 5, 7, 9. Each number increases by 2.",
          difficulty: "Easy",
          points: 100,
          category: "Number Patterns",
        },
        {
          id: 2,
          question: "All cats are animals. Fluffy is a cat. Therefore, Fluffy is an animal. This reasoning is:",
          options: ["Valid", "Invalid", "Incomplete", "Circular"],
          correctAnswer: 0, // Valid
          explanation: "This is a valid syllogism following the pattern: All A are B, C is A, therefore C is B.",
          difficulty: "Easy",
          points: 120,
          category: "Logic Puzzles",
        },
        {
          id: 3,
          question: "If it rains, then the ground gets wet. The ground is wet. What can we conclude?",
          options: ["It rained", "It didn't rain", "It may or may not have rained", "The statement is false"],
          correctAnswer: 2, // It may or may not have rained
          explanation:
            "This is the fallacy of affirming the consequent. The ground could be wet for other reasons (sprinkler, etc.).",
          difficulty: "Easy",
          points: 150,
          category: "Reasoning Questions",
        },
      ],
    },
    "small-league-logic-1": {
      contestTitle: "🏆 Logic Masters League",
      duration: 45 * 60, // 45 minutes in seconds
      prizeStructure: {
        first: 15000,
        second: 8000,
        third: 3000,
        participation: 500,
      },
      questions: [
        {
          id: 1,
          question:
            "In a logic puzzle, if A implies B, and B implies C, and C implies not-A, what can we conclude about A?",
          options: ["A is true", "A is false", "A is undetermined", "The system is inconsistent"],
          correctAnswer: 1, // A is false
          explanation:
            "If A were true, then B would be true (A→B), then C would be true (B→C), then A would be false (C→¬A). This contradiction means A must be false.",
          difficulty: "Medium",
          points: 200,
          category: "Advanced Logic Puzzles",
        },
        {
          id: 2,
          question:
            "A number when divided by 7 leaves remainder 3, and when divided by 11 leaves remainder 5. What is the smallest positive number satisfying these conditions?",
          options: ["38", "49", "71", "82"],
          correctAnswer: 0, // 38
          explanation: "Using Chinese Remainder Theorem: x ≡ 3 (mod 7) and x ≡ 5 (mod 11). The solution is x = 38.",
          difficulty: "Medium",
          points: 250,
          category: "Mathematical Reasoning",
        },
        {
          id: 3,
          question:
            "Five friends sit in a row. Alice is not at either end. Bob is to the right of Charlie. David is between Alice and Eve. If Charlie is at the left end, what is the seating arrangement?",
          options: [
            "Charlie, Bob, Alice, David, Eve",
            "Charlie, Alice, David, Bob, Eve",
            "Charlie, Bob, David, Alice, Eve",
            "Charlie, David, Alice, Bob, Eve",
          ],
          correctAnswer: 2, // Charlie, Bob, David, Alice, Eve
          explanation:
            "Given constraints: Charlie at left end, Bob right of Charlie, Alice not at ends, David between Alice and Eve. Only option C satisfies all conditions.",
          difficulty: "Hard",
          points: 300,
          category: "Abstract Problem Solving",
        },
      ],
    },
  }

  return (
    mcqData[contestId as keyof typeof mcqData] || {
      contestTitle: "Logic Challenge",
      duration: 30 * 60,
      prizeStructure: {
        first: 1000,
        second: 500,
        third: 200,
        participation: 50,
      },
      questions: [
        {
          id: 1,
          question: "Sample logic question for this contest.",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
          explanation: "This is a sample explanation.",
          difficulty: "Easy",
          points: 100,
          category: "Logic",
        },
      ],
    }
  )
}

export default function MCQPage() {
  const params = useParams()
  const router = useRouter()
  const contestId = params.id as string

  // Initialize MCQ data immediately without loading state
  const [mcqData] = useState(() => getMCQData(contestId))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(mcqData.duration)
  const [showResults, setShowResults] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false)

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

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted])

  // Start monitoring when component mounts
  useEffect(() => {
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

    startMonitoring()

    // Cleanup on unmount - always stop monitoring regardless of state
    return () => {
      console.log('MCQ component unmounting, stopping monitoring...')
      stopMonitoringAndCleanup()
    }
  }, [])

  // Add cleanup on page unload/navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Page unloading, cleaning up camera...')
      stopMonitoringAndCleanup()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Monitoring cleanup function
  const stopMonitoringAndCleanup = () => {
    console.log('Stopping monitoring and cleaning up camera...')
    contestMonitoring.stopMonitoring()
    setIsMonitoring(false)
    setShowFullscreenWarning(false)
    setShowFaceWarning(false)
    setShowVoiceWarning(false)
  }

  // Monitoring handler functions
  const handleReenterFullscreen = async () => {
    const success = await contestMonitoring.enterFullscreen()
    if (success) {
      setShowFullscreenWarning(false)
    }
  }

  const handleDismissFaceWarning = () => {
    setShowFaceWarning(false)
    faceCooldownRef.current = Date.now()
  }

  const handleDismissVoiceWarning = () => {
    setShowVoiceWarning(false)
    voiceCooldownRef.current = Date.now()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (isSubmitted) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }))
    setShowIncompleteWarning(false)
  }

  const getUnansweredQuestions = () => {
    const unanswered = []
    for (let i = 0; i < mcqData.questions.length; i++) {
      if (selectedAnswers[i] === undefined) {
        unanswered.push(i + 1)
      }
    }
    return unanswered
  }

  const isQuizComplete = () => {
    return Object.keys(selectedAnswers).length === mcqData.questions.length
  }

  const handleSubmit = () => {
    if (!isQuizComplete()) {
      setShowIncompleteWarning(true)
      return
    }
    setIsSubmitted(true)
    setShowResults(true)
    setShowIncompleteWarning(false)
    
    // Stop monitoring and cleanup camera when quiz is submitted
    stopMonitoringAndCleanup()
  }

  const handleRetakeQuiz = () => {
    // Reset all state to initial values
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setIsSubmitted(false)
    setShowIncompleteWarning(false)
    setTimeLeft(mcqData.duration)
  }

  const handleStartNewAttempt = () => {
    // Same as retake but with a different semantic meaning
    handleRetakeQuiz()
  }

  const calculateScore = () => {
    let correct = 0
    let totalPoints = 0

    mcqData.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
        totalPoints += question.points
      }
    })

    return {
      score: totalPoints,
      correct,
      total: mcqData.questions.length,
      percentage: Math.round((correct / mcqData.questions.length) * 100),
    }
  }

  const calculateWinnings = () => {
    const results = calculateScore()
    const { percentage } = results
    const { prizeStructure } = mcqData

    // Determine prize based on performance
    if (percentage >= 90) {
      return {
        position: "1st",
        amount: prizeStructure.first,
        message: "Outstanding performance! You've secured the top prize!",
        icon: "🥇",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      }
    } else if (percentage >= 75) {
      return {
        position: "2nd",
        amount: prizeStructure.second,
        message: "Excellent work! You've earned the second place prize!",
        icon: "🥈",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
    } else if (percentage >= 60) {
      return {
        position: "3rd",
        amount: prizeStructure.third,
        message: "Great job! You've won the third place prize!",
        icon: "🥉",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      }
    } else if (percentage >= 40) {
      return {
        position: "Participation",
        amount: prizeStructure.participation,
        message: "Thank you for participating! You've earned a participation reward!",
        icon: "🎖️",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      }
    } else {
      return {
        position: "No Prize",
        amount: 0,
        message:
          "Keep practicing and improving! Every attempt makes you stronger. Join our next contest for another chance to win!",
        icon: "💪",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      }
    }
  }

  const getQuestionStatus = (questionIndex: number) => {
    if (!showResults) {
      return selectedAnswers[questionIndex] !== undefined ? "answered" : "unanswered"
    }

    const question = mcqData.questions[questionIndex]
    const selectedAnswer = selectedAnswers[questionIndex]

    if (selectedAnswer === undefined) return "unanswered"
    if (selectedAnswer === question.correctAnswer) return "correct"
    return "incorrect"
  }

  const goToNextUnanswered = () => {
    const unanswered = getUnansweredQuestions()
    if (unanswered.length > 0) {
      setCurrentQuestion(unanswered[0] - 1)
    }
  }

  const results = showResults ? calculateScore() : null
  const winnings = showResults ? calculateWinnings() : null
  const currentQ = mcqData.questions[currentQuestion]
  const unansweredQuestions = getUnansweredQuestions()
  const completionPercentage = (Object.keys(selectedAnswers).length / mcqData.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Monitoring Components */}
      <MonitoringStatus isMonitoring={isMonitoring} violations={violations} />
      
      <FullscreenWarningDialog
        isOpen={showFullscreenWarning}
        onClose={() => setShowFullscreenWarning(false)}
        onReenterFullscreen={handleReenterFullscreen}
      />
      
      <FaceDetectionWarningDialog
        isOpen={showFaceWarning}
        onClose={handleDismissFaceWarning}
      />
      
      <VoiceDetectionWarningDialog
        isOpen={showVoiceWarning}
        onClose={handleDismissVoiceWarning}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href={`/contest/${contestId}`}>
                <MaterialButton variant="text" size="medium" startIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back to Contest
                </MaterialButton>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-600">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">{mcqData.contestTitle}</span>
              </div>
            </div>

            {/* Timer */}
            {!isSubmitted && (
              <div className="flex items-center gap-3">
                <MaterialCard
                  elevation={1}
                  className={`px-4 py-2 ${timeLeft <= 300 ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <Timer className={`h-4 w-4 ${timeLeft <= 300 ? "text-red-600" : "text-blue-600"}`} />
                    <span className={`font-mono font-bold ${timeLeft <= 300 ? "text-red-700" : "text-blue-700"}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </MaterialCard>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Question Navigation Sidebar */}
            <div className="lg:col-span-1">
              <MaterialCard elevation={1} className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                  {mcqData.questions.map((_, index: number) => {
                    const status = getQuestionStatus(index)
                    return (
                      <MaterialButton
                        key={index}
                        variant={currentQuestion === index ? "contained" : "outlined"}
                        size="medium"
                        onClick={() => setCurrentQuestion(index)}
                        className={`justify-start ${
                          status === "answered" && currentQuestion !== index
                            ? "bg-green-50 border-green-200 text-green-700"
                            : status === "unanswered" && currentQuestion !== index
                              ? "bg-red-50 border-red-200 text-red-700"
                              : ""
                        }`}
                        startIcon={
                          status === "answered" && currentQuestion !== index ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : status === "unanswered" && currentQuestion !== index ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <span className="w-4 h-4 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                          )
                        }
                      >
                        Q{index + 1}
                      </MaterialButton>
                    )
                  })}
                </div>

                {/* Enhanced Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>
                      {Object.keys(selectedAnswers).length}/{mcqData.questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        completionPercentage === 100 ? "bg-green-500" : "bg-purple-600"
                      }`}
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {completionPercentage === 100 ? (
                      <span className="text-green-600 font-medium">✓ All questions answered</span>
                    ) : (
                      <span>{Math.round(completionPercentage)}% completed</span>
                    )}
                  </div>
                </div>

                {/* Incomplete Warning */}
                {showIncompleteWarning && (
                  <MaterialCard elevation={1} className="mt-4 p-4 bg-red-50 border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900 mb-1">Quiz Incomplete</h4>
                        <p className="text-red-800 text-sm mb-2">Please answer all questions before submitting.</p>
                        <p className="text-red-700 text-xs">Unanswered: Q{unansweredQuestions.join(", Q")}</p>
                        <MaterialButton
                          size="small"
                          variant="outlined"
                          className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
                          onClick={goToNextUnanswered}
                        >
                          Go to Next Unanswered
                        </MaterialButton>
                      </div>
                    </div>
                  </MaterialCard>
                )}

                {/* Submit Button */}
                <MaterialButton
                  onClick={handleSubmit}
                  className={`w-full mt-6 ${
                    isQuizComplete() ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  startIcon={isQuizComplete() ? <CheckCircle2 className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
                >
                  {isQuizComplete() ? "Submit Complete Quiz" : `Submit Quiz (${unansweredQuestions.length} remaining)`}
                </MaterialButton>
              </MaterialCard>
            </div>

            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <MaterialCard elevation={2} className="p-8">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MaterialBadge variant="default" size="medium" className="bg-purple-100 text-purple-800">
                      Question {currentQuestion + 1} of {mcqData.questions.length}
                    </MaterialBadge>
                    <MaterialBadge variant="default" size="medium" className="bg-blue-100 text-blue-800">
                      {currentQ.category}
                    </MaterialBadge>
                    <MaterialBadge
                      variant="primary"
                      size="medium"
                      className={
                        currentQ.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : currentQ.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {currentQ.difficulty}
                    </MaterialBadge>
                    {selectedAnswers[currentQuestion] !== undefined && (
                      <MaterialBadge variant="default" size="medium" className="bg-green-100 text-green-800">
                        ✓ Answered
                      </MaterialBadge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-purple-600">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">{currentQ.points} points</span>
                  </div>
                </div>

                {/* Question Status Alert */}
                {selectedAnswers[currentQuestion] === undefined && (
                  <MaterialCard elevation={1} className="mb-6 p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span className="text-yellow-800 font-medium">This question needs an answer</span>
                    </div>
                  </MaterialCard>
                )}

                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 leading-relaxed">{currentQ.question}</h2>
                </div>

                {/* Answer Options */}
                <div className="space-y-4 mb-8">
                  {currentQ.options.map((option: string, index: number) => (
                    <MaterialCard
                      key={index}
                      elevation={1}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedAnswers[currentQuestion] === index
                          ? "bg-purple-50 border-2 border-purple-300"
                          : "bg-white border border-gray-200 hover:border-purple-200"
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[currentQuestion] === index
                              ? "bg-purple-600 border-purple-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedAnswers[currentQuestion] === index && <CheckCircle className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </div>
                    </MaterialCard>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <MaterialButton
                    variant="outlined"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    startIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Previous
                  </MaterialButton>
                  <MaterialButton
                    onClick={() => setCurrentQuestion(Math.min(mcqData.questions.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === mcqData.questions.length - 1}
                    endIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Next
                  </MaterialButton>
                </div>
              </MaterialCard>
            </div>
          </div>
        ) : (
          /* Results View - Only shown after complete submission */
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Quiz Completed Header */}
            <MaterialCard elevation={2} className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed Successfully!</h1>
                <p className="text-gray-600">
                  Congratulations! You have successfully completed all {mcqData.questions.length} questions in{" "}
                  {mcqData.contestTitle}
                </p>
                <MaterialBadge variant="default" size="medium" className="mt-4 bg-green-100 text-green-800">
                  ✓ All Questions Answered
                </MaterialBadge>
                <MaterialBadge variant="default" size="medium" className="mt-2 bg-blue-100 text-blue-800">
                  📹 Camera Monitoring Stopped
                </MaterialBadge>
              </div>

              {/* Score Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{results?.score}</div>
                  <div className="text-sm text-blue-800">Total Points</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{results?.correct}</div>
                  <div className="text-sm text-green-800">Correct Answers</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{results?.percentage}%</div>
                  <div className="text-sm text-purple-800">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">{results?.total}</div>
                  <div className="text-sm text-orange-800">Total Questions</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MaterialButton
                  onClick={handleRetakeQuiz}
                  size="medium"
                  className="bg-purple-600 hover:bg-purple-700"
                  startIcon={<RotateCcw className="h-5 w-5" />}
                >
                  Retake Quiz
                </MaterialButton>
                <MaterialButton
                  onClick={handleStartNewAttempt}
                  size="medium"
                  variant="outlined"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  startIcon={<Play className="h-5 w-5" />}
                >
                  Start New Attempt
                </MaterialButton>
                <MaterialButton
                  onClick={() => router.push("/")}
                  size="medium"
                  variant="outlined"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Back to Contests
                </MaterialButton>
              </div>
            </MaterialCard>

            {/* Winnings Section */}
            {winnings && (
              <MaterialCard elevation={2} className={`p-8 ${winnings.bgColor} border-2 ${winnings.borderColor}`}>
                <div className="text-center">
                  <div className="text-6xl mb-4">{winnings.icon}</div>
                  <h2 className={`text-2xl font-bold mb-4 ${winnings.color}`}>
                    {winnings.amount > 0
                      ? `Congratulations! You Won ${formatCCAmount(winnings.amount)}!`
                      : "Keep Going Strong!"}
                  </h2>
                  <p className={`text-lg mb-6 ${winnings.color}`}>{winnings.message}</p>

                  {winnings.amount > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Trophy className={`h-5 w-5 ${winnings.color}`} />
                        <span className={`font-semibold ${winnings.color}`}>Position: {winnings.position} Place</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gift className={`h-5 w-5 ${winnings.color}`} />
                        <span className={`font-semibold ${winnings.color}`}>
                          Prize: <span className="flex items-center gap-1">
                            <Coins className="h-3 w-3" />
                            {formatCCAmount(winnings.amount)}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`h-5 w-5 ${winnings.color}`} />
                        <span className={`font-semibold ${winnings.color}`}>
                          Score: {results?.percentage}% - Keep Improving!
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className={`h-5 w-5 ${winnings.color}`} />
                        <span className={`font-semibold ${winnings.color}`}>Next Goal: 60% for Prize Eligibility</span>
                      </div>
                    </div>
                  )}

                  {winnings.amount > 0 ? (
                    <MaterialCard elevation={1} className="p-4 bg-white/50 border border-white/20">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Prize Distribution:</strong> Your winnings will be credited to your wallet within 24
                        hours.
                      </p>
                      <p className="text-xs text-gray-600">
                        * Prizes are subject to verification and contest terms & conditions.
                      </p>
                    </MaterialCard>
                  ) : (
                    <MaterialCard elevation={1} className="p-4 bg-white/50 border border-white/20">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Upcoming Contests:</strong> Check out our other logic contests for more chances to win!
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        <MaterialBadge variant="default" size="small" className="bg-blue-100 text-blue-800">
                          Daily Logic Challenge
                        </MaterialBadge>
                        <MaterialBadge variant="default" size="small" className="bg-green-100 text-green-800">
                          Weekend Brain Teasers
                        </MaterialBadge>
                        <MaterialBadge variant="default" size="small" className="bg-purple-100 text-purple-800">
                          Monthly Mastermind
                        </MaterialBadge>
                      </div>
                    </MaterialCard>
                  )}
                </div>
              </MaterialCard>
            )}

            {/* Detailed Results */}
            <MaterialCard elevation={1} className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Results</h2>
              <div className="space-y-6">
                {mcqData.questions.map((question: any, index: number) => {
                  const selectedAnswer = selectedAnswers[index]
                  const isCorrect = selectedAnswer === question.correctAnswer
                  const wasAnswered = selectedAnswer !== undefined

                  return (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                      {/* Question Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">Question {index + 1}</span>
                          <MaterialBadge variant="default" size="small" className="bg-blue-100 text-blue-800">
                            {question.category}
                          </MaterialBadge>
                          <MaterialBadge
                            variant="primary"
                            size="small"
                            className={
                              question.difficulty === "Easy"
                                ? "bg-green-100 text-green-800"
                                : question.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {question.difficulty}
                          </MaterialBadge>
                        </div>
                        <div className="flex items-center gap-2">
                          {wasAnswered ? (
                            isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <span
                            className={`font-medium ${
                              !wasAnswered ? "text-gray-500" : isCorrect ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {!wasAnswered ? "Not Answered" : isCorrect ? `+${question.points} points` : "0 points"}
                          </span>
                        </div>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>

                      {/* Answer Options */}
                      <div className="space-y-2 mb-4">
                        {question.options.map((option: string, optionIndex: number) => {
                          const isSelected = selectedAnswer === optionIndex
                          const isCorrectOption = optionIndex === question.correctAnswer

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                isCorrectOption
                                  ? "bg-green-50 border-green-200"
                                  : isSelected && !isCorrectOption
                                    ? "bg-red-50 border-red-200"
                                    : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-700">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="text-gray-900">{option}</span>
                                {isCorrectOption && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                                {isSelected && !isCorrectOption && <XCircle className="h-4 w-4 text-red-600 ml-auto" />}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Explanation</h4>
                            <p className="text-blue-800 text-sm">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </MaterialCard>
          </div>
        )}
      </div>
    </div>
  )
}
