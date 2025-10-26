"use client"

import { useState, useEffect, useMemo, Suspense, lazy, useRef } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import {
  Code2,
  Trophy,
  Timer,
  Target,
  User,
  Users,
  Clock,
  ArrowLeft,
  Play,
  Share2,
  BookOpen,
  Crown,
  Medal,
  Award,
  Star,
  Gift,
  Coins,
  CreditCard,
  Wallet,
  AlertCircle,
  Brain,
  Zap,
  Paintbrush,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWallet } from "@/lib/wallet-context"

// Lazy load heavy components
const InviteFriendsDialog = lazy(() => import("./components/InviteFriendsDialog"))
const ContestRulesDialog = lazy(() => import("./components/ContestRulesDialog"))
const SubmissionInterface = lazy(() => import("./components/SubmissionInterface"))

// Optimized contest data structure - only essential fields for initial load
const getContestEssentials = (id: string) => {
  const essentials = {
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
      entryFee: 80,
      prizeType: "cash",
      difficulty: "intermediate",
      duration: "45 minutes",
      startTime: new Date(Date.now() + 1.5 * 60 * 1000),
      featured: true,
      isLive: true,
      showTimer: true,
      inviteCode: "LIGHTNING2024",
    },
    "practice-logic-1": {
      id: "practice-logic-1",
      title: "🧠 Logic Warm-up Challenge",
      description: "Sharpen your logical thinking with this free practice quiz. No stakes, just pure learning!",
      type: "logic",
      category: "practice",
      creator: "Logic Masters",
      participants: 189,
      maxParticipants: 300,
      entryFee: 0,
      prizeType: "free",
      difficulty: "beginner",
      duration: "30 minutes",
      featured: true,
      inviteCode: "LOGIC2024",
    },
    "practice-uiux-1": {
      id: "practice-uiux-1",
      title: "🎨 UI/UX Design Fundamentals",
      description: "Learn design principles through hands-on practice. Perfect for aspiring designers!",
      type: "ui-ux",
      category: "practice",
      creator: "Design Academy",
      participants: 156,
      maxParticipants: 250,
      entryFee: 0,
      prizeType: "free",
      difficulty: "beginner",
      duration: "45 minutes",
      submissionTimeLeft: "2 hours 15 minutes",
      submissionCount: 3,
      maxSubmissions: 5,
      featured: true,
      inviteCode: "DESIGN2024",
    },
    "practice-vibe-1": {
      id: "practice-vibe-1",
      title: "🎵 Rhythm Coding Jam",
      description: "Code to the beat! Creative coding challenge with live music. Join anytime!",
      type: "vibe-coding",
      category: "practice",
      creator: "Vibe Collective",
      participants: 47,
      maxParticipants: 50,
      entryFee: 0,
      prizeType: "free",
      difficulty: "beginner",
      duration: "1 hour",
      submissionTimeLeft: "45 minutes",
      submissionCount: 2,
      maxSubmissions: 3,
      featured: true,
      inviteCode: "VIBE2024",
    },
  }

  return essentials[id as keyof typeof essentials] || null
}

// Async function to load detailed contest data with minimal delay
const getContestDetails = async (id: string) => {
  // Minimal delay for better UX - reduced from 300ms to 50ms
  await new Promise((resolve) => setTimeout(resolve, 50))

  const details = {
    "live-dsa-urgent": {
      tags: ["Lightning Round", "Quick", "High Stakes"],
      prizeDistribution: [
        { position: "1st", percentage: 50, amount: 950, count: 1 },
        { position: "2nd", percentage: 30, amount: 570, count: 1 },
        { position: "3rd", percentage: 20, amount: 380, count: 1 },
      ],
      problems: [
        { id: 1, title: "Array Manipulation", difficulty: "Medium", points: 200 },
        { id: 2, title: "String Algorithms", difficulty: "Medium", points: 250 },
        { id: 3, title: "Graph Traversal", difficulty: "Hard", points: 300 },
      ],
      rules: [
        "Contest duration is 45 minutes",
        "3 problems to solve in order of difficulty",
        "Partial scoring available for incomplete solutions",
        "No external resources allowed",
        "Plagiarism will result in disqualification",
      ],
    },
    "practice-logic-1": {
      tags: ["Practice", "Logic", "Quick"],
      completionRate: 92,
      averageScore: 78,
      learningBenefits: ["Skill Assessment", "Progress Tracking", "Performance Analytics"],
      problems: [
        { id: 1, title: "Pattern Recognition", difficulty: "Easy", points: 100, type: "mcq", options: 4 },
        { id: 2, title: "Logical Sequences", difficulty: "Easy", points: 100, type: "mcq", options: 4 },
        { id: 3, title: "Analytical Reasoning", difficulty: "Easy", points: 150, type: "puzzle" },
      ],
      rules: [
        "30-minute logic challenge",
        "3 pattern recognition problems",
        "Multiple choice and puzzle-based questions",
        "Immediate feedback on answers",
        "Practice mode with learning focus",
      ],
    },
    "practice-uiux-1": {
      tags: ["Practice", "Design", "Creative"],
      completionRate: 88,
      averageScore: 75,
      learningBenefits: ["Design Skills", "Portfolio Building", "Creative Thinking"],
      problems: [
        {
          id: 1,
          title: "Color Theory Basics",
          difficulty: "Easy",
          points: 100,
          type: "design",
          deliverable: "Color palette",
        },
        {
          id: 2,
          title: "Typography Principles",
          difficulty: "Easy",
          points: 100,
          type: "design",
          deliverable: "Font selection",
        },
        {
          id: 3,
          title: "Layout Design",
          difficulty: "Easy",
          points: 150,
          type: "design",
          deliverable: "Wireframe mockup",
        },
      ],
      rules: [
        "45-minute design challenge",
        "3 design principle tasks",
        "Visual design and theory questions",
        "Portfolio-building exercises",
        "Creative problem-solving focus",
      ],
    },
    "practice-vibe-1": {
      tags: ["Vibe Coding", "Music", "Creative"],
      completionRate: 92,
      averageScore: 85,
      learningBenefits: ["Creative Thinking", "Music Integration", "Fun Learning"],
      problems: [
        {
          id: 1,
          title: "Rhythm Pattern Generator",
          difficulty: "Easy",
          points: 100,
          type: "creative",
          theme: "Music visualization",
        },
        {
          id: 2,
          title: "Music Visualizer",
          difficulty: "Easy",
          points: 150,
          type: "creative",
          theme: "Audio processing",
        },
        {
          id: 3,
          title: "Beat Matching Algorithm",
          difficulty: "Medium",
          points: 200,
          type: "creative",
          theme: "Rhythm analysis",
        },
      ],
      rules: [
        "1-hour creative coding session",
        "Music-themed programming challenges",
        "Creative expression encouraged",
        "Collaborative coding environment",
        "Fun and experimental approach",
      ],
    },
  }

  return details[id as keyof typeof details] || null
}

// Optimized Payment Confirmation Dialog
const PaymentConfirmationDialog = ({
  contest,
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}: {
  contest: any
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isProcessing: boolean
}) => {
  if (!contest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Confirm Payment
          </DialogTitle>
          <DialogDescription>Review your contest entry details before proceeding.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <MaterialCard elevation={1} className="p-4 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-2">{contest.title}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">Entry Fee:</span>
                <span className="font-medium text-blue-900 flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  {formatCCAmount(contest.entryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Prize Pool:</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  {contest.prizePool !== undefined ? formatCCAmount(contest.prizePool) : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Duration:</span>
                <span className="font-medium text-blue-900">{contest.duration}</span>
              </div>
            </div>
          </MaterialCard>

          <div className="flex gap-3">
            <MaterialButton variant="outlined" onClick={onClose} className="flex-1" disabled={isProcessing}>
              Cancel
            </MaterialButton>
            <MaterialButton
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1"
              startIcon={
                isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Coins className="h-4 w-4" />
                )
              }
            >
              {isProcessing ? "Processing..." : "Pay & Join"}
            </MaterialButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Loading skeleton component
const ContestSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[var(--z-sticky)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </header>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Function to format Codarena Coins amount
const formatCCAmount = (amount: number): string => {
  return `${amount.toLocaleString("en-IN")} CC`
}

export default function ContestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { balance, deductAmount } = useWallet()
  const contestId = params.id as string

  // Separate state for essential and detailed data
  const [contestEssentials, setContestEssentials] = useState<any>(null)
  const [contestDetails, setContestDetails] = useState<any>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Dialog states
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showRulesDialog, setShowRulesDialog] = useState(false)

  // New state for tracking if user has joined design contest and submission status
  const [hasJoinedDesignContest, setHasJoinedDesignContest] = useState(false)
  const [hasSubmittedWork, setHasSubmittedWork] = useState(false)

  // Ref for submission interface
  const submissionInterfaceRef = useRef<HTMLDivElement>(null)

  // Load essential contest data immediately
  useEffect(() => {
    const essentials = getContestEssentials(contestId)
    setContestEssentials(essentials)

    // Load detailed data asynchronously
    if (essentials) {
      setIsLoadingDetails(true)
      getContestDetails(contestId).then((details) => {
        setContestDetails(details)
        setIsLoadingDetails(false)
      })
    }
  }, [contestId])

  // Listen for submission events from SubmissionInterface
  useEffect(() => {
    const handleSubmissionSuccess = () => {
      setHasSubmittedWork(true)
    }

    // In a real app, this would be handled through props or context
    // For now, we'll simulate this with a timeout after joining
    if (hasJoinedDesignContest && !hasSubmittedWork) {
      const timer = setTimeout(() => {
        // This is just for demo - in real app, submission status would come from the SubmissionInterface component
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [hasJoinedDesignContest, hasSubmittedWork])

  // Memoized combined contest data
  const contest = useMemo(() => {
    if (!contestEssentials) return null
    return { ...contestEssentials, ...contestDetails }
  }, [contestEssentials, contestDetails])

  // Memoized time calculations
  const timeInfo = useMemo(() => {
    if (!contest?.showTimer || !contest?.startTime) return null

    const diff = contest.startTime.getTime() - currentTime.getTime()
    if (diff <= 0) return { text: "Started", isUrgent: false, isStarted: true }

    const totalSeconds = Math.floor(diff / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const isUrgent = totalSeconds <= 300

    if (days > 0) return { text: `${days}d ${hours % 24}h`, isUrgent: false, isStarted: false }
    if (hours > 0) return { text: `${hours}h ${minutes % 60}m`, isUrgent: false, isStarted: false }
    if (minutes > 0) return { text: isUrgent ? `${minutes}m ${seconds}s` : `${minutes}m`, isUrgent, isStarted: false }
    return { text: `${seconds}s`, isUrgent: true, isStarted: false }
  }, [contest?.showTimer, contest?.startTime, currentTime])

  // Optimized timer update - only for contests with timers and reduced frequency for non-urgent contests
  useEffect(() => {
    if (!contest?.showTimer) return

    const updateInterval = contest?.isUrgent ? 1000 : 5000 // Update every 5 seconds for non-urgent contests

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, updateInterval)

    return () => clearInterval(timer)
  }, [contest?.showTimer, contest?.isUrgent])

  // Memoized utility functions
  const getContestTypeIcon = useMemo(
    () => (type: string) => {
      switch (type) {
        case "dsa":
          return Code2
        case "logic":
          return Brain
        case "vibe-coding":
          return Zap
        case "ui-ux":
          return Paintbrush
        default:
          return Target
      }
    },
    [],
  )

  const getContestTypeColor = useMemo(
    () => (type: string) => {
      switch (type) {
        case "dsa":
          return "bg-blue-600"
        case "logic":
          return "bg-purple-600"
        case "vibe-coding":
          return "bg-pink-600"
        case "ui-ux":
          return "bg-orange-600"
        default:
          return "bg-blue-600"
      }
    },
    [],
  )

  const getCategoryColor = useMemo(
    () => (category: string) => {
      switch (category) {
        case "practice":
          return "bg-green-100 text-green-800 border-green-200"
        case "beginner-special":
          return "bg-blue-100 text-blue-800 border-blue-200"
        case "small-league":
          return "bg-purple-100 text-purple-800 border-purple-200"
        case "mega-contest":
          return "bg-orange-100 text-orange-800 border-orange-200"
        case "high-roller":
          return "bg-yellow-100 text-yellow-800 border-yellow-200"
        default:
          return "bg-gray-100 text-gray-800 border-gray-200"
      }
    },
    [],
  )

  const getCategoryLabel = useMemo(
    () => (category: string) => {
      switch (category) {
        case "practice":
          return "Practice"
        case "beginner-special":
          return "Beginner Special"
        case "small-league":
          return "Small League"
        case "mega-contest":
          return "Mega Contest"
        case "high-roller":
          return "High Roller"
        default:
          return "Contest"
      }
    },
    [],
  )

  const getContestTypeLabel = useMemo(
    () => (type: string) => {
      switch (type) {
        case "dsa":
          return "DSA"
        case "logic":
          return "Logic"
        case "vibe-coding":
          return "Vibe Coding"
        case "ui-ux":
          return "UI/UX"
        default:
          return "Contest"
      }
    },
    [],
  )

  // Check if contest is a design contest
  const isDesignContest = (contestType: string) => {
    return contestType === "ui-ux" || contestType === "vibe-coding"
  }

  // Smooth scroll to submission interface
  const scrollToSubmissionInterface = () => {
    if (submissionInterfaceRef.current) {
      submissionInterfaceRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleJoinContest = () => {
    if (!contest) return

    // Check if it's a design contest
    if (isDesignContest(contest.type)) {
      // For design contests, change button state and scroll to submission
      setHasJoinedDesignContest(true)
      // Small delay to allow state update before scrolling
      setTimeout(() => {
        scrollToSubmissionInterface()
      }, 100)
      return
    }

    // Original logic for non-design contests
    if (contest.prizeType === "cash") {
      if (balance < contest.entryFee) {
        alert("Insufficient balance! Please add funds to your wallet.")
        router.push("/wallet")
        return
      }
      setShowPaymentDialog(true)
    } else {
      if (contest.type === "logic") {
        router.push(`/contest/${contest.id}/mcq`)
      }
    }
  }

  const handlePaymentConfirm = async () => {
    setIsProcessingPayment(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      deductAmount(contest.entryFee, "Contest entry fee", contest.title)
      setShowPaymentDialog(false)

      if (contest.type === "dsa") {
        router.push(`/contest/${contest.id}/editor`)
      } else if (contest.type === "logic") {
        router.push(`/contest/${contest.id}/mcq`)
      }
    } catch (error) {
      console.error("Payment failed:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Show skeleton while loading essentials
  if (!contestEssentials) {
    return <ContestSkeleton />
  }

  const isUrgent = timeInfo?.isUrgent || false
  const isStarted = timeInfo?.isStarted || false
  const TypeIcon = getContestTypeIcon(contest.type)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optimized Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-[var(--z-sticky)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <MaterialButton variant="text" size="medium" startIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back to Contests
                </MaterialButton>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getContestTypeColor(contest.type)}`}>
                  <TypeIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Contest Details</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/wallet">
                <MaterialButton variant="text" size="medium" startIcon={<Coins className="h-4 w-4" />}>
                  {formatCCAmount(balance)}
                </MaterialButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contest Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contest Header - Always visible */}
            <MaterialCard elevation={2} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <MaterialBadge variant="default" size="medium" className={getCategoryColor(contest.category)}>
                      {getCategoryLabel(contest.category)}
                    </MaterialBadge>
                    <MaterialBadge variant="default" size="medium" className="bg-blue-100 text-blue-800">
                      {getContestTypeLabel(contest.type)}
                    </MaterialBadge>
                    {contest.featured && (
                      <MaterialBadge variant="default" size="medium" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </MaterialBadge>
                    )}
                    {isUrgent && !isStarted && (
                      <MaterialBadge variant="default" size="medium" className="bg-red-100 text-red-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Starting Soon!
                      </MaterialBadge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">{contest.title}</h1>
                  <p className="text-gray-600 mb-4">{contest.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {contest.creator}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {contest.duration}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                      <Target className="h-4 w-4" />
                      {contest.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {contest.participants} participants
                    </span>
                  </div>
                </div>

                {/* Timer Section */}
                {contest.showTimer && timeInfo && (
                  <div className="flex-shrink-0">
                    <MaterialCard
                      elevation={1}
                      className={`p-4 text-center min-w-[140px] ${
                        isUrgent && !isStarted
                          ? "bg-red-50 border border-red-200"
                          : isStarted
                            ? "bg-green-50 border border-green-200"
                            : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Timer
                          className={`h-5 w-5 ${
                            isUrgent && !isStarted ? "text-red-600" : isStarted ? "text-green-600" : "text-blue-600"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isUrgent && !isStarted ? "text-red-600" : isStarted ? "text-green-600" : "text-blue-600"
                          }`}
                        >
                          {isStarted ? "Live Now" : "Starts in"}
                        </span>
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          isUrgent && !isStarted ? "text-red-700" : isStarted ? "text-green-700" : "text-blue-700"
                        }`}
                      >
                        {timeInfo.text}
                      </div>
                    </MaterialCard>
                  </div>
                )}
              </div>

              {/* Contest Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{contestDetails?.problems?.length || "..."}</div>
                  <div className="text-sm text-blue-800">
                    {contest.type === "logic"
                      ? "Questions"
                      : contest.type === "ui-ux"
                        ? "Tasks"
                        : contest.type === "vibe-coding"
                          ? "Challenges"
                          : "Problems"}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{contest.participants}</div>
                  <div className="text-sm text-green-800">Participants</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {contest.prizeType === "cash" ? formatCCAmount(contest.prizePool) : "FREE"}
                  </div>
                  <div className="text-sm text-purple-800">Prize Pool</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{contest.duration}</div>
                  <div className="text-sm text-orange-800">Duration</div>
                </div>
              </div>
            </MaterialCard>

            {/* Contest Problems/Tasks - Lazy loaded */}
            {contestDetails?.problems ? (
              <MaterialCard elevation={1} className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TypeIcon className="h-5 w-5 text-blue-600" />
                  Contest{" "}
                  {contest.type === "logic"
                    ? "Questions"
                    : contest.type === "ui-ux"
                      ? "Tasks"
                      : contest.type === "vibe-coding"
                        ? "Challenges"
                        : "Problems"}
                </h2>
                <div className="space-y-4">
                  {contestDetails.problems.map((problem: any, index: number) => (
                    <div key={problem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{problem.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MaterialBadge
                              variant="default"
                              size="small"
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
                            <span className="text-sm text-gray-500">{problem.points} points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </MaterialCard>
            ) : isLoadingDetails ? (
              <MaterialCard elevation={1} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </MaterialCard>
            ) : null}

            {/* Submission Interface - Lazy loaded with ref */}
            {isDesignContest(contest.type) && (
              <div ref={submissionInterfaceRef}>
                <Suspense fallback={<div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>}>
                  <SubmissionInterface contest={contest} />
                </Suspense>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Join Contest Card */}
            <MaterialCard elevation={2} className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {contest.prizeType === "cash"
                    ? `Entry fee: ${formatCCAmount(contest.entryFee)}`
                    : "Free practice contest - no entry fee required!"}
                </p>
                <MaterialButton
                  size="large"
                  onClick={handleJoinContest}
                  disabled={isDesignContest(contest.type) && hasJoinedDesignContest}
                  className={`w-full ${getContestTypeColor(contest.type)} hover:opacity-90 text-white ${
                    isDesignContest(contest.type) && hasJoinedDesignContest ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  startIcon={
                    isDesignContest(contest.type) && hasJoinedDesignContest ? (
                      <Upload className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )
                  }
                >
                  {isDesignContest(contest.type) && hasJoinedDesignContest
                    ? "Contest Joined"
                    : contest.prizeType === "cash"
                      ? "Pay & Join Contest"
                      : "Join Free Contest"}
                </MaterialButton>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <MaterialButton
                  variant="outlined"
                  size="medium"
                  fullWidth
                  onClick={() => setShowInviteDialog(true)}
                  startIcon={<Share2 className="h-4 w-4" />}
                >
                  Invite Friends
                </MaterialButton>
                <MaterialButton
                  variant="outlined"
                  size="medium"
                  fullWidth
                  onClick={() => setShowRulesDialog(true)}
                  startIcon={<BookOpen className="h-4 w-4" />}
                >
                  View Contest Rules
                </MaterialButton>
              </div>
            </MaterialCard>

            {/* Prize Pool Card - Lazy loaded */}
            {contest.prizeType === "cash" ? (
              contestDetails?.prizeDistribution ? (
                <MaterialCard elevation={1} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Prize Distribution
                  </h3>
                  <div className="space-y-3">
                    {contestDetails.prizeDistribution.slice(0, 3).map((prize: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <div className="flex items-center gap-3">
                          {index === 0 && <Crown className="h-4 w-4 text-yellow-600" />}
                          {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                          {index === 2 && <Award className="h-4 w-4 text-amber-600" />}
                          <span className="font-medium text-gray-900">{prize.position}</span>
                        </div>
                        <span className="font-bold text-green-600 flex items-center gap-1">
                          <Coins className="h-3 w-3" />
                          {formatCCAmount(prize.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </MaterialCard>
              ) : (
                <MaterialCard elevation={1} className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </MaterialCard>
              )
            ) : (
              contestDetails?.learningBenefits && (
                <MaterialCard elevation={1} className="p-6 bg-green-50">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Practice Benefits
                  </h3>
                  <div className="space-y-2">
                    {contestDetails.learningBenefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-green-700">
                        <Star className="h-4 w-4" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </MaterialCard>
              )
            )}

            {/* Contest Information */}
            <MaterialCard elevation={1} className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contest Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">{getContestTypeLabel(contest.type)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium text-gray-900 capitalize">{contest.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{contest.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium text-gray-900">{contest.participants}</span>
                </div>
              </div>
            </MaterialCard>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <PaymentConfirmationDialog
        contest={contest}
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onConfirm={handlePaymentConfirm}
        isProcessing={isProcessingPayment}
      />

      <Suspense fallback={null}>
        <InviteFriendsDialog contest={contest} isOpen={showInviteDialog} onClose={() => setShowInviteDialog(false)} />
      </Suspense>

      <Suspense fallback={null}>
        <ContestRulesDialog contest={contest} isOpen={showRulesDialog} onClose={() => setShowRulesDialog(false)} />
      </Suspense>
    </div>
  )
}
