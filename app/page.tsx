"use client"

import { useState, useEffect, useMemo } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import { MaterialInput } from "@/components/ui/material-input"
import {
  Code2,
  Trophy,
  Timer,
  Target,
  Send,
  User,
  Plus,
  Play,
  Users,
  Menu,
  Crown,
  Medal,
  Award,
  Star,
  Gift,
  Brain,
  Heart,
  Coins,
  Filter,
  Zap,
  Paintbrush,
  X,
  Flame,
  CheckCircle,
  CreditCard,
  Share2,
  BookOpen,
  Copy,
  DollarSign,
  Sparkles,
  Calculator,
} from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/lib/wallet-context"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

// Function to calculate dynamic prize pool in Codarena Coins (CC)
const calculateDynamicPrizePool = (participants: number, entryFee: number): number => {
  const totalCollected = participants * entryFee
  const platformCommission = totalCollected * 0.4 // 40% platform commission
  const finalPrizePool = totalCollected - platformCommission
  return Math.round(finalPrizePool)
}

// Function to get prize pool calculation details in Codarena Coins (CC)
const getPrizePoolDetails = (participants: number, entryFee: number) => {
  const totalCollected = participants * entryFee
  const platformCommission = totalCollected * 0.4
  const finalPrizePool = totalCollected - platformCommission
  return {
    totalCollected: Math.round(totalCollected),
    platformCommission: Math.round(platformCommission),
    finalPrizePool: Math.round(finalPrizePool)
  }
}

// Function to format Codarena Coins amount
const formatCCAmount = (amount: number): string => {
  return `${amount.toLocaleString("en-IN")} CC`
}

// Optimized contest data structure - only essential fields for immediate display
const contestEssentials = [
  {
    id: "live-dsa-urgent",
    title: "🔥 Lightning DSA Challenge",
    description: "Quick-fire coding challenge starting any moment! Perfect for testing your speed and accuracy.",
    type: "dsa",
    category: "small-league",
    creator: "Speed Coders",
    participants: 21,
    maxParticipants: 25,
    entryFee: 80,
    prizeType: "cash",
    difficulty: "intermediate",
    duration: "45 minutes",
    startTime: new Date(Date.now() - 5 * 60 * 1000), // Started 5 minutes ago
    tags: ["Lightning Round", "Quick", "High Stakes"],
    featured: true,
    isLive: true,
    showTimer: true,
  },
  {
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
    startTime: new Date(Date.now() + 5 * 60 * 1000),
    tags: ["Practice", "Free", "Beginner Friendly"],
    featured: true,
    showTimer: true,
    completionRate: 85,
  },
  {
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
    tags: ["Practice", "Logic", "Quick"],
    featured: true,
    completionRate: 92,
  },
  {
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
    tags: ["Practice", "Design", "Creative"],
    featured: true,
    completionRate: 88,
  },
  {
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
    tags: ["Vibe Coding", "Music", "Creative"],
    featured: true,
    completionRate: 92,
  },
  {
    id: "beginner-dsa-1",
    title: "🌟 First Steps Coding Contest",
    description: "Your first paid contest! Beginner-friendly problems with encouraging rewards and low entry fee.",
    type: "dsa",
    category: "beginner-special",
    creator: "Beginner's Hub",
    participants: 67,
    maxParticipants: 100,
    entryFee: 15,
    prizeType: "cash",
    difficulty: "beginner",
    duration: "1.5 hours",
    tags: ["Beginner Special", "Low Entry", "Encouraging"],
    featured: true,
  },
  {
    id: "beginner-logic-1",
    title: "🎓 Logic Builder Challenge",
    description: "Build your logical thinking skills with this beginner-friendly contest. Great for newcomers!",
    type: "logic",
    category: "beginner-special",
    creator: "Logic Academy",
    participants: 43,
    maxParticipants: 60,
    entryFee: 10,
    prizeType: "cash",
    difficulty: "beginner",
    duration: "45 minutes",
    tags: ["Beginner Special", "Logic", "Affordable"],
    featured: true,
  },
  {
    id: "beginner-vibe-1",
    title: "🎵 Vibe Coding Jam Session",
    description: "Code to the rhythm! A unique coding experience with music and creative challenges.",
    type: "vibe-coding",
    category: "beginner-special",
    creator: "Vibe Coders",
    participants: 45,
    maxParticipants: 80,
    entryFee: 10,
    prizeType: "cash",
    difficulty: "beginner",
    duration: "2 hours",
    tags: ["Vibe Coding", "Creative", "Music"],
    featured: true,
  },
  {
    id: "small-league-dsa-1",
    title: "⚔️ Elite Coders Circle",
    description: "Exclusive small group competition! Only 25 spots available for this intense coding battle.",
    type: "dsa",
    category: "small-league",
    creator: "Elite Coding Club",
    participants: 23,
    maxParticipants: 25,
    entryFee: 100,
    prizeType: "cash",
    difficulty: "intermediate",
    duration: "2 hours",
    tags: ["Small League", "Exclusive", "Elite"],
    featured: true,
  },
  {
    id: "small-league-logic-1",
    title: "🏆 Logic Masters League",
    description: "Special small league for logic enthusiasts. Intimate competition with high-quality questions.",
    type: "logic",
    category: "small-league",
    creator: "Logic League Pro",
    participants: 18,
    maxParticipants: 20,
    entryFee: 75,
    prizeType: "cash",
    difficulty: "intermediate",
    duration: "45 minutes",
    tags: ["Small League", "Logic Focus", "Premium"],
    featured: true,
  },
  {
    id: "small-league-uiux-1",
    title: "🎨 Designer's Elite Challenge",
    description: "Premium design contest for creative professionals. Limited spots, high-quality judging.",
    type: "ui-ux",
    category: "small-league",
    creator: "Design Elite Pro",
    participants: 15,
    maxParticipants: 20,
    entryFee: 125,
    prizeType: "cash",
    difficulty: "intermediate",
    duration: "3 hours",
    tags: ["Small League", "Design", "Premium"],
    featured: true,
  },
  {
    id: "mega-contest-dsa-1",
    title: "🚀 Mega DSA Championship",
    description: "The biggest DSA contest of the month! Open to all skill levels with massive prize pool.",
    type: "dsa",
    category: "mega-contest",
    creator: "Mega Contest Pro",
    participants: 475,
    maxParticipants: 1000,
    entryFee: 100,
    prizeType: "cash",
    difficulty: "mixed",
    duration: "3 hours",
    tags: ["Mega Contest", "Championship", "Massive Pool"],
    featured: true,
  },
  {
    id: "mega-contest-logic-1",
    title: "🧠 Mega Logic Championship",
    description: "Ultimate logic contest with the biggest prize pool! Test your reasoning skills.",
    type: "logic",
    category: "mega-contest",
    creator: "Logic Championship Pro",
    participants: 332,
    maxParticipants: 500,
    entryFee: 50,
    prizeType: "cash",
    difficulty: "mixed",
    duration: "2 hours",
    tags: ["Mega Contest", "Logic", "Championship"],
    featured: true,
  },
  {
    id: "mega-contest-uiux-1",
    title: "🎨 Mega Design Championship",
    description: "The ultimate design contest! Showcase your creativity and win big prizes.",
    type: "ui-ux",
    category: "mega-contest",
    creator: "Design Championship Pro",
    participants: 285,
    maxParticipants: 400,
    entryFee: 100,
    prizeType: "cash",
    difficulty: "mixed",
    duration: "4 hours",
    tags: ["Mega Contest", "Design", "Creative"],
    featured: true,
  },
  {
    id: "high-roller-dsa-1",
    title: "💎 High Roller DSA Elite",
    description: "Exclusive high-stakes contest for elite coders. Massive entry fee, massive rewards.",
    type: "dsa",
    category: "high-roller",
    creator: "High Roller Elite",
    participants: 95,
    maxParticipants: 200,
    entryFee: 500,
    prizeType: "cash",
    difficulty: "expert",
    duration: "4 hours",
    tags: ["High Roller", "Elite", "High Stakes"],
    featured: true,
  },
  {
    id: "high-roller-logic-1",
    title: "💎 High Roller Logic Elite",
    description: "Premium logic contest for the elite. High entry fee, exceptional rewards.",
    type: "logic",
    category: "high-roller",
    creator: "Logic Elite Pro",
    participants: 67,
    maxParticipants: 100,
    entryFee: 250,
    prizeType: "cash",
    difficulty: "expert",
    duration: "2.5 hours",
    tags: ["High Roller", "Logic", "Premium"],
    featured: true,
  },
]

// Lazy-loaded detailed contest data cache
const contestDetailsCache = new Map()

// Async function to load detailed contest data only when needed
const loadContestDetails = async (contestId: string) => {
  // Return cached data immediately if available
  if (contestDetailsCache.has(contestId)) {
    return contestDetailsCache.get(contestId)
  }

  // Minimal delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 50))

  const detailsMap: Record<string, any> = {
    "live-dsa-urgent": {
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
      inviteCode: "LIGHTNING2024",
    },
    "practice-dsa-1": {
      learningBenefits: ["Skill Assessment", "Progress Tracking", "Performance Analytics"],
      problems: [
        { id: 1, title: "Two Sum", difficulty: "Easy", points: 100 },
        { id: 2, title: "Valid Parentheses", difficulty: "Easy", points: 100 },
        { id: 3, title: "Merge Two Sorted Lists", difficulty: "Easy", points: 150 },
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
    "practice-logic-1": {
      learningBenefits: ["Skill Assessment", "Progress Tracking", "Performance Analytics"],
      problems: [
        { id: 1, title: "Pattern Recognition", difficulty: "Easy", points: 100 },
        { id: 2, title: "Logical Sequences", difficulty: "Easy", points: 100 },
        { id: 3, title: "Analytical Reasoning", difficulty: "Easy", points: 150 },
      ],
      rules: [
        "30-minute logic challenge",
        "3 pattern recognition problems",
        "Multiple choice and fill-in answers",
        "Immediate feedback on answers",
        "Practice mode with learning focus",
      ],
      inviteCode: "LOGIC2024",
    },
    "practice-uiux-1": {
      learningBenefits: ["Design Skills", "Portfolio Building", "Creative Thinking"],
      problems: [
        { id: 1, title: "Color Theory Basics", difficulty: "Easy", points: 100 },
        { id: 2, title: "Typography Principles", difficulty: "Easy", points: 100 },
        { id: 3, title: "Layout Design", difficulty: "Easy", points: 150 },
      ],
      rules: [
        "45-minute design challenge",
        "3 design principle tasks",
        "Visual design and theory questions",
        "Portfolio-building exercises",
        "Creative problem-solving focus",
      ],
      inviteCode: "DESIGN2024",
    },
    "practice-vibe-1": {
      learningBenefits: ["Creative Thinking", "Music Integration", "Fun Learning"],
      problems: [
        { id: 1, title: "Rhythm Pattern Generator", difficulty: "Easy", points: 100 },
        { id: 2, title: "Music Visualizer", difficulty: "Easy", points: 150 },
        { id: 3, title: "Beat Matching Algorithm", difficulty: "Medium", points: 200 },
      ],
      rules: [
        "1-hour creative coding session",
        "3 music-themed programming challenges",
        "Creative expression encouraged",
        "Collaborative coding environment",
        "Fun and experimental approach",
      ],
      inviteCode: "VIBE2024",
    },
  }

  const details = detailsMap[contestId] || {
    prizeDistribution: [
      { position: "1st", percentage: 40, amount: 500, count: 1 },
      { position: "2nd", percentage: 30, amount: 300, count: 1 },
      { position: "3rd", percentage: 30, amount: 200, count: 1 },
    ],
    problems: [{ id: 1, title: "Challenge Problem", difficulty: "Medium", points: 200 }],
    rules: ["Standard contest rules apply"],
    inviteCode: "CONTEST2024",
  }

  // Cache the result for future use
  contestDetailsCache.set(contestId, details)
  return details
}

// Payment Confirmation Dialog
function PaymentConfirmationDialog({
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
}) {
  if (!contest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
            Confirm Payment
          </DialogTitle>
          <DialogDescription>Review your contest entry details before proceeding</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contest Details */}
          <MaterialCard elevation={1} className="p-4 bg-blue-50">
            <h4 className="md-subtitle-1 font-medium text-blue-900 mb-2">{contest.title}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">Contest Type:</span>
                <span className="font-medium text-blue-900 capitalize">{contest.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Duration:</span>
                <span className="font-medium text-blue-900">{contest.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Difficulty:</span>
                <span className="font-medium text-blue-900 capitalize">{contest.difficulty}</span>
              </div>
            </div>
          </MaterialCard>

          {/* Payment Details */}
          <MaterialCard elevation={1} className="p-4 bg-green-50">
            <h4 className="md-subtitle-1 font-medium text-green-900 mb-3 flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Payment Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-800">Entry Fee:</span>
                <span className="font-bold text-green-900 flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  {formatCCAmount(contest.entryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Payment Method:</span>
                <span className="font-medium text-green-900">Wallet Balance</span>
              </div>
              <div className="border-t border-green-200 pt-2 flex justify-between">
                <span className="text-green-900 font-medium">Total Amount:</span>
                <span className="font-bold text-green-600 flex items-center gap-1">
                  <Coins className="h-4 w-4" />
                  {formatCCAmount(contest.entryFee)}
                </span>
              </div>
            </div>
          </MaterialCard>

          {/* Prize Information */}
          {contest.prizeType === "cash" && (
            <MaterialCard elevation={1} className="p-4 bg-yellow-50">
              <h4 className="md-subtitle-1 font-medium text-yellow-900 mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Prize Pool
              </h4>
              <div className="text-center">
                <p className="md-headline-6 font-bold text-yellow-700 flex items-center gap-1">
                  <Coins className="h-5 w-5" />
                  {formatCCAmount(calculateDynamicPrizePool(contest.participants, contest.entryFee))}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {/*contest.prizeDistribution.reduce((sum: number, p: any) => sum + p.count, 0)*/} winners
                </p>
              </div>
            </MaterialCard>
          )}

          {/* Action Buttons */}
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
                  <CheckCircle className="h-4 w-4" />
                )
              }
            >
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </MaterialButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Optimized Prize Breakdown Dialog with lazy loading
function PrizeBreakdownDialog({
  contest,
  isOpen,
  onClose,
}: {
  contest: any
  isOpen: boolean
  onClose: () => void
}) {
  const [details, setDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && contest && !details) {
      setLoading(true)
      loadContestDetails(contest.id).then((data) => {
        setDetails(data)
        setLoading(false)
      })
    }
  }, [isOpen, contest, details])

  if (!contest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-600" />
            Prize Pool Breakdown
          </DialogTitle>
          <DialogDescription>
            {contest.prizeType === "cash"
              ? `Total prize pool: ${formatCCAmount(calculateDynamicPrizePool(contest.participants, contest.entryFee))} • Entry fee: ${formatCCAmount(contest.entryFee)}`
              : "Free practice contest with digital rewards"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : contest.prizeType === "cash" ? (
            <>
              {/* Prize Pool Calculation Breakdown */}
              <MaterialCard elevation={1} className="p-4 mb-4 bg-blue-50">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Prize Pool Calculation
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Collected:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {formatCCAmount(getPrizePoolDetails(contest.participants, contest.entryFee).totalCollected)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Commission (40%):</span>
                    <span className="font-medium text-red-600 flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      -{formatCCAmount(getPrizePoolDetails(contest.participants, contest.entryFee).platformCommission)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-gray-900">Final Prize Pool:</span>
                    <span className="font-bold text-green-600 flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {formatCCAmount(getPrizePoolDetails(contest.participants, contest.entryFee).finalPrizePool)}
                    </span>
                  </div>
                </div>
              </MaterialCard>

              <MaterialCard elevation={1} className="p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Winner Distribution
                </h4>
              <div className="space-y-3">
                {details?.prizeDistribution?.map((prize: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <div className="flex items-center gap-3">
                      {index === 0 && <Crown className="h-5 w-5 text-yellow-600" />}
                      {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                      {index === 2 && <Award className="h-5 w-5 text-amber-600" />}
                      {index > 2 && <Star className="h-5 w-5 text-blue-600" />}
                      <div>
                        <span className="font-medium text-gray-900">{prize.position}</span>
                        <MaterialBadge variant="default" size="small" className="ml-2">
                          {prize.count} winner{prize.count > 1 ? "s" : ""}
                        </MaterialBadge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600 flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {formatCCAmount(prize.amount)}
                      </span>
                      <div className="text-xs text-gray-500">{prize.percentage}% each</div>
                    </div>
                  </div>
                )) || <div className="text-center py-4 text-gray-500">Prize details loading...</div>}
              </div>
            </MaterialCard>
            </>
          ) : (
            <MaterialCard elevation={1} className="p-4 bg-green-50">
              <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Practice Rewards
              </h4>
              <div className="space-y-2">
                {details?.learningBenefits?.map((reward: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-green-700">
                    <Star className="h-4 w-4" />
                    <span>{reward}</span>
                  </div>
                )) || <div className="text-center py-4 text-gray-500">Reward details loading...</div>}
              </div>
              {contest.completionRate && (
                <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                  <strong>Success Rate:</strong> {contest.completionRate}% of participants complete this contest
                </div>
              )}
            </MaterialCard>
          )}

          <MaterialButton onClick={onClose} fullWidth>
            Got it!
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Leaderboard Dialog Component
function LeaderboardDialog({
  contest,
  isOpen,
  onClose,
}: {
  contest: any
  isOpen: boolean
  onClose: () => void
}) {
  if (!contest) return null

  // Mock leaderboard data based on contest category
  const generateMockLeaderboard = (category: string) => {
    const baseData = [
      { username: "CodeNinja", avatar: "🥇" },
      { username: "AlgoMaster", avatar: "🥈" },
      { username: "DevGuru", avatar: "🥉" },
      { username: "ByteWarrior", avatar: "⚡" },
      { username: "CodeCrusher", avatar: "🔥" },
    ]

    return baseData.map((user, index) => ({
      rank: index + 1,
      ...user,
      score: Math.floor(Math.random() * 1000) + 2000,
      status: index < 3 ? "completed" : "in-progress",
      category: category,
    }))
  }

  const mockLeaderboard = generateMockLeaderboard(contest.category)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <Trophy className="h-6 w-6 text-blue-600" />
            Live Leaderboard
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Current rankings for "{contest.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          <MaterialCard elevation={1} className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Current Rankings</h3>
              <div className="flex gap-2">
                <MaterialBadge variant="default" size="medium" className="bg-blue-100 text-blue-800 border-blue-200">
                  {contest.participants} participants
                </MaterialBadge>
                <MaterialBadge
                  variant={
                    contest.category === "practice"
                      ? "success"
                      : contest.category === "high-roller"
                        ? "warning"
                        : "default"
                  }
                  size="medium"
                  className={
                    contest.category === "practice"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : contest.category === "high-roller"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {contest.category.replace("-", " ")}
                </MaterialBadge>
              </div>
            </div>

            <div className="space-y-3">
              {mockLeaderboard.map((participant) => (
                <div
                  key={participant.rank}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{participant.avatar}</div>
                    <div>
                      <div className="font-semibold text-gray-900 text-base">
                        #{participant.rank} {participant.username}
                      </div>
                      <div className="text-sm text-gray-600">
                        Score: <span className="font-medium text-gray-800">{participant.score}</span> •
                        <span className="capitalize">{participant.status}</span>
                      </div>
                    </div>
                  </div>
                  <MaterialBadge
                    variant={participant.status === "completed" ? "success" : "default"}
                    size="small"
                    className={
                      participant.status === "completed"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }
                  >
                    {participant.status}
                  </MaterialBadge>
                </div>
              ))}
            </div>
          </MaterialCard>
        </div>

        <div className="flex-shrink-0 pt-4 border-t border-gray-200">
          <MaterialButton onClick={onClose} fullWidth className="bg-blue-600 hover:bg-blue-700 text-white">
            Close
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Optimized Invite Friends Dialog with lazy loading
function InviteFriendsDialog({
  contest,
  isOpen,
  onClose,
}: {
  contest: any
  isOpen: boolean
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    if (isOpen && contest && !details) {
      loadContestDetails(contest.id).then(setDetails)
    }
  }, [isOpen, contest, details])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!contest) return null

  const contestUrl = `${window.location.origin}/contest/${contest.id}`
  const inviteCode = details?.inviteCode || "CONTEST2024"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <Share2 className="h-6 w-6 text-blue-600" />
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Share this contest with your friends and compete together!
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          <MaterialCard elevation={1} className="p-4 bg-blue-50 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 text-base">{contest.title}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Duration:</span>
                <span className="text-blue-900 font-semibold">{contest.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Difficulty:</span>
                <span className="text-blue-900 font-semibold capitalize">{contest.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Entry:</span>
                <span className="text-blue-900 font-semibold">
                  {contest.prizeType === "cash" ? formatCCAmount(contest.entryFee) : "Free Practice"}
                </span>
              </div>
            </div>
          </MaterialCard>

          <div>
            <label className="block font-semibold text-gray-900 mb-3 text-base">Contest Code</label>
            <div className="flex gap-2">
              <MaterialInput
                value={inviteCode}
                readOnly
                className="flex-1 font-mono bg-gray-50 border-gray-300 text-gray-900 font-semibold"
              />
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={() => handleCopy(inviteCode)}
                startIcon={copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
              >
                {copied ? "Copied!" : "Copy"}
              </MaterialButton>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-3 text-base">Direct Link</label>
            <div className="flex gap-2">
              <MaterialInput
                value={contestUrl}
                readOnly
                className="flex-1 text-sm bg-gray-50 border-gray-300 text-gray-800"
              />
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={() => handleCopy(contestUrl)}
                startIcon={copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
              >
                {copied ? "Copied!" : "Copy"}
              </MaterialButton>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 pt-4 border-t border-gray-200">
          <MaterialButton onClick={onClose} fullWidth className="bg-blue-600 hover:bg-blue-700 text-white">
            Done
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Improve the ContestRulesDialog with better contrast, readability, and scrollable content
function ContestRulesDialog({
  contest,
  isOpen,
  onClose,
}: {
  contest: any
  isOpen: boolean
  onClose: () => void
}) {
  const [details, setDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && contest && !details) {
      setLoading(true)
      loadContestDetails(contest.id).then((data) => {
        setDetails(data)
        setLoading(false)
      })
    }
  }, [isOpen, contest, details])

  if (!contest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Contest Rules
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Important guidelines for "{contest.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <MaterialCard elevation={1} className="p-5 bg-blue-50 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-4 text-lg">Contest Overview</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between sm:flex-col sm:justify-start">
                <span className="text-blue-700 font-medium">Duration:</span>
                <span className="font-semibold text-blue-900 sm:mt-1">{contest.duration}</span>
              </div>
              <div className="flex justify-between sm:flex-col sm:justify-start">
                <span className="text-blue-700 font-medium">Problems:</span>
                <span className="font-semibold text-blue-900 sm:mt-1">{details?.problems?.length || "Loading..."}</span>
              </div>
              <div className="flex justify-between sm:flex-col sm:justify-start">
                <span className="text-blue-700 font-medium">Difficulty:</span>
                <span className="font-semibold text-blue-900 capitalize sm:mt-1">{contest.difficulty}</span>
              </div>
              <div className="flex justify-between sm:flex-col sm:justify-start">
                <span className="text-blue-700 font-medium">Type:</span>
                <span className="font-semibold text-blue-900 uppercase sm:mt-1">{contest.type}</span>
              </div>
            </div>
          </MaterialCard>

          <MaterialCard elevation={1} className="p-5 bg-white border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Contest Rules</h4>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {details?.rules?.map((rule: string, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 flex-1 leading-relaxed font-medium">{rule}</p>
                  </div>
                )) || (
                  <div className="text-center py-6 text-gray-500">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Rules loading...</p>
                  </div>
                )}
              </div>
            )}
          </MaterialCard>

          <MaterialCard elevation={1} className="p-5 bg-yellow-50 border border-yellow-200">
            <h4 className="font-semibold text-yellow-900 mb-4 text-lg flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              General Guidelines
            </h4>
            <div className="space-y-3 text-sm max-h-48 overflow-y-auto pr-2">
              <div className="flex items-start gap-3 p-2 bg-yellow-100 rounded border border-yellow-300">
                <span className="text-yellow-700 font-bold">•</span>
                <p className="text-yellow-800 font-medium">Ensure stable internet connection throughout the contest</p>
              </div>
              <div className="flex items-start gap-3 p-2 bg-yellow-100 rounded border border-yellow-300">
                <span className="text-yellow-700 font-bold">•</span>
                <p className="text-yellow-800 font-medium">Submit solutions before the time limit expires</p>
              </div>
              <div className="flex items-start gap-3 p-2 bg-yellow-100 rounded border border-yellow-300">
                <span className="text-yellow-700 font-bold">•</span>
                <p className="text-yellow-800 font-medium">Contact support if you encounter technical issues</p>
              </div>
              <div className="flex items-start gap-3 p-2 bg-yellow-100 rounded border border-yellow-300">
                <span className="text-yellow-700 font-bold">•</span>
                <p className="text-yellow-800 font-medium">Fair play is expected from all participants</p>
              </div>
              <div className="flex items-start gap-3 p-2 bg-yellow-100 rounded border border-yellow-300">
                <span className="text-yellow-700 font-bold">•</span>
                <p className="text-yellow-800 font-medium">Results will be announced after contest completion</p>
              </div>
            </div>
          </MaterialCard>
        </div>

        <div className="flex-shrink-0 pt-4 border-t border-gray-200">
          <MaterialButton onClick={onClose} fullWidth className="bg-blue-600 hover:bg-blue-700 text-white">
            I Understand
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CodarenaApp() {
  const [email, setEmail] = useState("")
  const { balance, deductAmount } = useWallet()
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const [selectedContestForPrize, setSelectedContestForPrize] = useState<any>(null)
  const [showPrizeBreakdown, setShowPrizeBreakdown] = useState(false)
  const [selectedContestForLeaderboard, setSelectedContestForLeaderboard] = useState<any>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>("all") // New price filter state
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isScrolling, setIsScrolling] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [showHowItWorks, setShowHowItWorks] = useState(true)

  // Add scroll indicator effect
  useEffect(() => {
    const handleScroll = () => {
      const contestSection = document.getElementById("contest-section")
      if (contestSection) {
        const rect = contestSection.getBoundingClientRect()
        const isInView = rect.top >= 0 && rect.top <= window.innerHeight
        setIsScrolling(!isInView && rect.top > 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Payment flow states
  const [selectedContestForPayment, setSelectedContestForPayment] = useState<any>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Invite friends dialog states
  const [selectedContestForInvite, setSelectedContestForInvite] = useState<any>(null)
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  // Contest rules dialog states
  const [selectedContestForRules, setSelectedContestForRules] = useState<any>(null)
  const [showRulesDialog, setShowRulesDialog] = useState(false)

  // Update current time every second for live timer (only for contests with showTimer)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getContestTypeLabel = (type: string) => {
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
        return "Challenge"
    }
  }

  const getContestTypeIcon = (type: string) => {
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
  }

  const getCategoryColor = (category: string) => {
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
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dsa":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "logic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "vibe-coding":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "ui-ux":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-200"
    }
  }

  const getCategoryLabel = (category: string) => {
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
  }

  const formatTimeUntilStart = (startTime: Date) => {
    const diff = startTime.getTime() - currentTime.getTime()

    if (diff <= 0) return { text: "Started", isUrgent: false, isStarted: true }

    const totalSeconds = Math.floor(diff / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    const isUrgent = totalSeconds <= 300 // 5 minutes or less

    if (days > 0) return { text: `${days}d ${hours % 24}h`, isUrgent: false, isStarted: false }
    if (hours > 0) return { text: `${hours}h ${minutes % 60}m`, isUrgent: false, isStarted: false }
    if (minutes > 0)
      return {
        text: isUrgent ? `${minutes}m ${seconds}s` : `${minutes}m`,
        isUrgent,
        isStarted: false,
      }
    return { text: `${seconds}s`, isUrgent: true, isStarted: false }
  }

  const handleJoinContest = async (contest: any) => {
    if (contest.prizeType === "free") {
      // For free contests, redirect directly to contest lobby
      router.push(`/contest/${contest.id}/lobby`)
      return
    }

    // For paid contests, show payment confirmation
    setSelectedContestForPayment(contest)
    setShowPaymentDialog(true)
  }

  const handlePaymentConfirm = async () => {
    if (!selectedContestForPayment) return

    setIsProcessingPayment(true)

    try {
      // Check if user has sufficient balance
      if (balance < selectedContestForPayment.entryFee) {
        alert("Insufficient balance! Please add funds to your wallet.")
        return
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Deduct entry fee from wallet
      deductAmount(selectedContestForPayment.entryFee, "Contest entry fee", selectedContestForPayment.title)

      // Close payment dialog and redirect to contest lobby
      setShowPaymentDialog(false)
      router.push(`/contest/${selectedContestForPayment.id}/lobby`)
      setSelectedContestForPayment(null)
    } catch (error) {
      console.error("Error processing payment:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleDialogClose = () => {
    if (!isProcessingPayment) {
      setShowPaymentDialog(false)
      setSelectedContestForPayment(null)
    }
  }

  // Handle hero button clicks
  const handleJoinLiveContest = () => {
    // Smooth scroll to contest section
    const contestSection = document.getElementById("contest-section")
    if (contestSection) {
      contestSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Optional: Set filter to show paid contests after scrolling
      setTimeout(() => {
        setSelectedPriceFilter("paid")
      }, 800)
    }
  }

  const handlePracticeForFree = () => {
    // Smooth scroll to contest section
    const contestSection = document.getElementById("contest-section")
    if (contestSection) {
      contestSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Optional: Set filter to show free contests after scrolling
      setTimeout(() => {
        setSelectedPriceFilter("free")
      }, 800)
    }
  }

  // Group contests by type and price using contestEssentials
  const contestsByType = contestEssentials.reduce(
    (acc, contest) => {
      if (!acc[contest.type]) {
        acc[contest.type] = []
      }
      acc[contest.type].push(contest)
      return acc
    },
    {} as Record<string, typeof contestEssentials>,
  )

  const contestsByPrice = useMemo(() => {
    return contestEssentials.reduce(
      (acc, contest) => {
        const priceCategory = contest.prizeType === "free" ? "free" : "paid"
        if (!acc[priceCategory]) {
          acc[priceCategory] = []
        }
        acc[priceCategory].push(contest)
        return acc
      },
      {} as Record<string, typeof contestEssentials>,
    )
  }, [])

  // Sort contests: contests with timers first, then regular contests
  const sortedContests = [...contestEssentials].sort((a, b) => {
    // Prioritize contests with timers
    if (a.showTimer && !b.showTimer) return -1
    if (!a.showTimer && b.showTimer) return 1

    // Then sort by category priority
    const categoryPriority = {
      practice: 1,
      "beginner-special": 2,
      "small-league": 3,
      "mega-contest": 4,
      "high-roller": 5,
    }

    return (
      (categoryPriority[a.category as keyof typeof categoryPriority] || 6) -
      (categoryPriority[b.category as keyof typeof categoryPriority] || 6)
    )
  })

  // Enhanced filtering logic to handle both type and price filters
  const filteredContests = useMemo(() => {
    let filtered = sortedContests

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter((contest) => contest.type === selectedType)
    }

    // Apply price filter
    if (selectedPriceFilter !== "all") {
      filtered = filtered.filter((contest) => {
        if (selectedPriceFilter === "free") {
          return contest.prizeType === "free"
        } else if (selectedPriceFilter === "paid") {
          return contest.prizeType === "cash"
        }
        return true
      })
    }

    return filtered
  }, [sortedContests, selectedType, selectedPriceFilter])

  const clearFilters = () => {
    setSelectedType(null)
    setSelectedPriceFilter("all")
  }

  const hasActiveFilters = selectedType !== null || selectedPriceFilter !== "all"

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Matching the provided design */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[var(--z-sticky)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Matching the design */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-600">Codarena</h1>
                <p className="text-xs text-gray-500 -mt-1">Daily Coding Battles</p>
              </div>
            </div>

            {/* Navigation - Matching the design */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              <Link
                href="/create-contest"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Create</span>
              </Link>
              <Link
                href="/join"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <Users className="h-4 w-4" />
                <span>Join</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              
              {/* Authentication Section */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/wallet"
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold"
                  >
                    <Coins className="h-4 w-4" />
                    <span>{formatCCAmount(balance)}</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                    <MaterialButton
                      variant="outlined"
                      size="small"
                      onClick={logout}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50"
                    >
                      Logout
                    </MaterialButton>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link href="/register">
                    <MaterialButton
                      size="small"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Sign Up
                    </MaterialButton>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <MaterialButton variant="outlined" size="medium" className="md:hidden">
              <Menu className="h-5 w-5" />
            </MaterialButton>
          </div>
        </div>
      </header>

      {/* Disclaimer Banner */}
      {showDisclaimer && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {/* Icon and Title Row */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full">
                  <span className="text-amber-600 text-sm">⚠️</span>
                </div>
                <span className="font-semibold text-amber-800 text-sm sm:text-base">Demo Notice</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-amber-700 text-sm sm:text-base leading-relaxed">
                  This is a working demo with mock data. For the best experience, please open on desktop.
                  <span className="block sm:inline mt-1 sm:mt-0 sm:ml-1 font-medium">
                    We're currently raising funds to launch our MVP and scale.
                  </span>
                </p>
              </div>

              {/* Close Button */}
              <div className="flex-shrink-0 self-start sm:self-center">
                <MaterialButton
                  variant="text"
                  size="small"
                  onClick={() => setShowDisclaimer(false)}
                  className="text-amber-600 hover:bg-amber-100 p-2 rounded-full min-w-0 w-8 h-8"
                  aria-label="Close disclaimer"
                >
                  <X className="h-4 w-4" />
                </MaterialButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Matching the provided design exactly */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        {/* Subtle dot pattern background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge - Matching the design */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
              <span>🚀</span>
              <span>Daily Coding Battles • Live Now</span>
            </div>
          </div>

          {/* Main Headline - Matching the blue gradient text */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
              Code. Compete. Conquer.
            </span>
          </h1>

          {/* Action Buttons - Smaller and refined */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <MaterialButton
              onClick={handleJoinLiveContest}
              size="medium"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              startIcon={<Flame className="h-4 w-4" />}
            >
              JOIN LIVE CONTEST
            </MaterialButton>
            <MaterialButton
              onClick={handlePracticeForFree}
              variant="outlined"
              size="medium"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 font-semibold rounded-lg transition-all duration-300"
              startIcon={<Play className="h-4 w-4" />}
            >
              PRACTICE FOR FREE
            </MaterialButton>
          </div>
        </div>
      </section>

      {/* How It Works Alert Section */}
      {showHowItWorks && (
        <section className="py-8 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      How <span className="text-blue-600">Codarena</span> Works
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Select a Contest</h4>
                        <p className="text-sm text-gray-600">Choose from DSA, Logic, UI/UX challenges and more</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Solve Live Problems</h4>
                        <p className="text-sm text-gray-600">Compete in real-time and climb the leaderboard</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Win Rewards & Level Up</h4>
                        <p className="text-sm text-gray-600">Earn cash prizes and build your reputation</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <MaterialButton
                  variant="text"
                  size="small"
                  onClick={() => setShowHowItWorks(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full min-w-0 w-8 h-8 flex-shrink-0"
                  aria-label="Close how it works section"
                >
                  <X className="h-4 w-4" />
                </MaterialButton>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Contest Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="md-headline-5 text-gray-900 mb-2">Featured Contests</h2>
              <p className="md-body-1 text-gray-600">
                {filteredContests.length} contest{filteredContests.length !== 1 ? "s" : ""} available
                {hasActiveFilters && (
                  <span className="text-blue-600">
                    {" "}
                    • Filtered by{" "}
                    {[
                      selectedType && getContestTypeLabel(selectedType),
                      selectedPriceFilter !== "all" && (selectedPriceFilter === "free" ? "Free" : "Paid"),
                    ]
                      .filter(Boolean)
                      .join(" & ")}
                  </span>
                )}
              </p>
            </div>
            {hasActiveFilters && (
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={clearFilters}
                startIcon={<X className="h-4 w-4" />}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Clear All Filters
              </MaterialButton>
            )}
          </div>

          {/* Enhanced Filter Controls */}
          <div className="space-y-4">
            {/* Price Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 min-w-fit">Filter by Price:</span>
                <div className="flex flex-wrap gap-2">
                  <MaterialButton
                    variant={selectedPriceFilter === "all" ? "contained" : "outlined"}
                    size="medium"
                    onClick={() => setSelectedPriceFilter("all")}
                    startIcon={<Filter className="h-4 w-4" />}
                    className={
                      selectedPriceFilter === "all"
                        ? "bg-blue-600 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    All Contests ({contestEssentials.length})
                  </MaterialButton>
                  <MaterialButton
                    variant={selectedPriceFilter === "free" ? "contained" : "outlined"}
                    size="medium"
                    onClick={() => setSelectedPriceFilter("free")}
                    startIcon={<Sparkles className="h-4 w-4" />}
                    className={
                      selectedPriceFilter === "free"
                        ? "bg-green-600 text-white"
                        : "border-green-300 text-green-700 hover:bg-green-50"
                    }
                  >
                    Free Practice ({contestsByPrice.free?.length || 0})
                  </MaterialButton>
                  <MaterialButton
                    variant={selectedPriceFilter === "paid" ? "contained" : "outlined"}
                    size="medium"
                    onClick={() => setSelectedPriceFilter("paid")}
                    startIcon={<DollarSign className="h-4 w-4" />}
                    className={
                      selectedPriceFilter === "paid"
                        ? "bg-yellow-600 text-white"
                        : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    }
                  >
                    Paid Contests ({contestsByPrice.paid?.length || 0})
                  </MaterialButton>
                </div>
              </div>
            </div>

            {/* Type Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 min-w-fit">Filter by Type:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(contestsByType).map(([type, contests]) => {
                    const Icon = getContestTypeIcon(type)
                    return (
                      <MaterialButton
                        key={type}
                        variant={selectedType === type ? "contained" : "outlined"}
                        size="medium"
                        onClick={() => setSelectedType(selectedType === type ? null : type)}
                        startIcon={<Icon className="h-4 w-4" />}
                        className={
                          selectedType === type
                            ? "bg-blue-600 text-white"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }
                      >
                        {getContestTypeLabel(type)} ({contests.length})
                      </MaterialButton>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-800">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Active Filters: {filteredContests.length} of {contestEssentials.length} contests shown
                  </span>
                </div>
                <MaterialButton
                  variant="text"
                  size="small"
                  onClick={clearFilters}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  Reset
                </MaterialButton>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contest Listings */}
      <section id="contest-section" className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredContests.length === 0 ? (
            /* No Results State */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="md-headline-6 text-gray-900 mb-2">No contests found</h3>
                  <p className="md-body-2 text-gray-600 mb-6">
                    No contests match your current filters. Try adjusting your search criteria.
                  </p>
                  <MaterialButton onClick={clearFilters} startIcon={<X className="h-4 w-4" />}>
                    Clear All Filters
                  </MaterialButton>
                </div>
              </div>
            </div>
          ) : (
            /* Contest Cards */
            <div className="space-y-6">
              {filteredContests.map((contest) => {
                const timeInfo = contest.showTimer && contest.startTime ? formatTimeUntilStart(contest.startTime) : null
                const isUrgent = timeInfo?.isUrgent || false
                const isStarted = timeInfo?.isStarted || false
                const Icon = getContestTypeIcon(contest.type)

                return (
                  <MaterialCard
                    key={contest.id}
                    elevation={contest.featured ? 3 : 1}
                    className={`p-6 transition-all duration-300 hover:md-elevation-4 ${
                      contest.featured ? "border-l-4 border-blue-500" : ""
                    } ${isUrgent && !isStarted ? "ring-2 ring-red-400 ring-opacity-50" : ""}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Left Section - Contest Info */}
                      <div className="flex-1 space-y-4">
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${getTypeColor(contest.type)}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="md-headline-6 text-gray-900">{contest.title}</h3>
                                {contest.featured && (
                                  <MaterialBadge variant="warning" size="small">
                                    Featured
                                  </MaterialBadge>
                                )}
                                {contest.isLive && (
                                  <MaterialBadge variant="destructive" size="small" className="animate-pulse">
                                    <div className="flex items-center gap-1">
                                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                      LIVE
                                    </div>
                                  </MaterialBadge>
                                )}
                                {contest.prizeType === "free" && (
                                  <MaterialBadge
                                    variant="success"
                                    size="small"
                                    className="bg-green-100 text-green-800 border-green-200"
                                  >
                                    FREE
                                  </MaterialBadge>
                                )}
                              </div>
                              <p className="md-body-2 text-gray-600 mb-3">{contest.description}</p>
                              <div className="flex flex-wrap gap-2">
                                <MaterialBadge
                                  variant="outline"
                                  size="small"
                                  className={getCategoryColor(contest.category)}
                                >
                                  {getCategoryLabel(contest.category)}
                                </MaterialBadge>
                                <MaterialBadge variant="outline" size="small" className={getTypeColor(contest.type)}>
                                  {getContestTypeLabel(contest.type)}
                                </MaterialBadge>
                                <MaterialBadge variant="outline" size="small">
                                  {contest.difficulty}
                                </MaterialBadge>
                                <MaterialBadge variant="outline" size="small">
                                  {contest.duration}
                                </MaterialBadge>
                              </div>
                            </div>
                          </div>

                          {/* Timer Section (for contests with showTimer) */}
                          {timeInfo && (
                            <MaterialCard
                              elevation={1}
                              className={`p-4 text-center min-w-[140px] ${
                                isUrgent && !isStarted
                                  ? "bg-red-50 border-red-200"
                                  : isStarted
                                    ? "bg-green-50 border-green-200"
                                    : "bg-blue-50 border-blue-200"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Timer
                                  className={`h-4 w-4 ${
                                    isUrgent && !isStarted
                                      ? "text-red-600"
                                      : isStarted
                                        ? "text-green-600"
                                        : "text-blue-600"
                                  }`}
                                />
                                <span
                                  className={`text-xs font-medium ${
                                    isUrgent && !isStarted
                                      ? "text-red-800"
                                      : isStarted
                                        ? "text-green-800"
                                        : "text-blue-800"
                                  }`}
                                >
                                  {isStarted ? "STARTED" : "STARTS IN"}
                                </span>
                              </div>
                              <div
                                className={`md-headline-6 font-bold ${
                                  isUrgent && !isStarted
                                    ? "text-red-600"
                                    : isStarted
                                      ? "text-green-600"
                                      : "text-blue-600"
                                }`}
                              >
                                {timeInfo.text}
                              </div>
                            </MaterialCard>
                          )}
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>
                              {contest.participants}/{contest.maxParticipants || "∞"} participants
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>by {contest.creator}</span>
                          </div>
                          {contest.prizeType === "free" && (
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-600">Free Practice</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {contest.tags && (
                          <div className="flex flex-wrap gap-2">
                            {contest.tags.map((tag: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        {/* Prize Pool Information - Above Join Button */}
                        {contest.prizeType === "cash" && (
                          <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 mb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-medium text-gray-900">Prize Pool</span>
                              </div>
                              <span className="text-lg font-bold text-green-600 flex items-center gap-1">
                                <Coins className="h-4 w-4" />
                                {formatCCAmount(calculateDynamicPrizePool(contest.participants, contest.entryFee))}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Primary Action */}
                        <MaterialButton
                          onClick={() => handleJoinContest(contest)}
                          size="large"
                          fullWidth
                          className={
                            contest.prizeType === "free"
                              ? "bg-green-600 hover:bg-green-700"
                              : isUrgent && !isStarted
                                ? "bg-red-600 hover:bg-red-700 animate-pulse"
                                : "bg-blue-600 hover:bg-blue-700"
                          }
                          startIcon={
                            contest.prizeType === "free" ? (
                              <Play className="h-4 w-4" />
                            ) : isUrgent && !isStarted ? (
                              <Flame className="h-4 w-4" />
                            ) : (
                              <Trophy className="h-4 w-4" />
                            )
                          }
                        >
                          {contest.prizeType === "free" ? "Practice Now" : `${formatCCAmount(contest.entryFee)}`}
                        </MaterialButton>

                        {/* Secondary Actions */}
                        <div className="mb-2">
                          <MaterialButton
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSelectedContestForPrize(contest)
                              setShowPrizeBreakdown(true)
                            }}
                            startIcon={<Trophy className="h-3 w-3" />}
                            fullWidth
                          >
                            {contest.prizeType === "cash" ? "Prizes" : "Rewards"}
                          </MaterialButton>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <MaterialButton
                            variant="text"
                            size="small"
                            onClick={() => {
                              setSelectedContestForInvite(contest)
                              setShowInviteDialog(true)
                            }}
                            startIcon={<Share2 className="h-3 w-3" />}
                          >
                            Invite
                          </MaterialButton>
                          <MaterialButton
                            variant="text"
                            size="small"
                            onClick={() => {
                              setSelectedContestForRules(contest)
                              setShowRulesDialog(true)
                            }}
                            startIcon={<BookOpen className="h-3 w-3" />}
                          >
                            Rules
                          </MaterialButton>
                        </div>
                      </div>
                    </div>
                  </MaterialCard>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="md-headline-4 mb-4">Stay Updated with Latest Contests</h2>
            <p className="md-body-1 text-blue-100 mb-8">
              Get notified about new contests, special events, and exclusive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <MaterialInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white"
              />
              <MaterialButton
                variant="contained"
                className="bg-white text-blue-600 hover:bg-gray-50"
                startIcon={<Send className="h-4 w-4" />}
              >
                Subscribe
              </MaterialButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="md-headline-4 mb-4">Stay Updated with Latest Contests</h2>
            <p className="md-body-1 text-blue-100 mb-8">
              Get notified about new contests, special events, and exclusive opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <MaterialInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white"
              />
              <MaterialButton
                variant="contained"
                className="bg-white text-blue-600 hover:bg-gray-50"
                startIcon={<Send className="h-4 w-4" />}
              >
                Subscribe
              </MaterialButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-full">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <span className="md-headline-6">Codarena</span>
              </div>
              <p className="md-body-2 text-gray-400">
                The ultimate platform for coding contests and skill development.
              </p>
            </div>
            <div>
              <h3 className="md-subtitle-1 mb-4">Platform</h3>
              <div className="space-y-2">
                <Link href="/contests" className="block md-body-2 text-gray-400 hover:text-white">
                  Browse Contests
                </Link>
                <Link href="/practice" className="block md-body-2 text-gray-400 hover:text-white">
                  Practice Problems
                </Link>
                <Link href="/leaderboard" className="block md-body-2 text-gray-400 hover:text-white">
                  Leaderboard
                </Link>
              </div>
            </div>
            <div>
              <h3 className="md-subtitle-1 mb-4">Community</h3>
              <div className="space-y-2">
                <Link href="/discord" className="block md-body-2 text-gray-400 hover:text-white">
                  Discord
                </Link>
                <Link href="/forum" className="block md-body-2 text-gray-400 hover:text-white">
                  Forum
                </Link>
                <Link href="/blog" className="block md-body-2 text-gray-400 hover:text-white">
                  Blog
                </Link>
              </div>
            </div>
            <div>
              <h3 className="md-subtitle-1 mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/help" className="block md-body-2 text-gray-400 hover:text-white">
                  Help Center
                </Link>
                <Link href="/contact" className="block md-body-2 text-gray-400 hover:text-white">
                  Contact Us
                </Link>
                <Link href="/privacy" className="block md-body-2 text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="md-body-2 text-gray-400">© 2024 Codarena. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <PaymentConfirmationDialog
        contest={selectedContestForPayment}
        isOpen={showPaymentDialog}
        onClose={handleDialogClose}
        onConfirm={handlePaymentConfirm}
        isProcessing={isProcessingPayment}
      />

      <PrizeBreakdownDialog
        contest={selectedContestForPrize}
        isOpen={showPrizeBreakdown}
        onClose={() => {
          setShowPrizeBreakdown(false)
          setSelectedContestForPrize(null)
        }}
      />

      <LeaderboardDialog
        contest={selectedContestForLeaderboard}
        isOpen={showLeaderboard}
        onClose={() => {
          setShowLeaderboard(false)
          setSelectedContestForLeaderboard(null)
        }}
      />

      <InviteFriendsDialog
        contest={selectedContestForInvite}
        isOpen={showInviteDialog}
        onClose={() => {
          setShowInviteDialog(false)
          setSelectedContestForInvite(null)
        }}
      />

      <ContestRulesDialog
        contest={selectedContestForRules}
        isOpen={showRulesDialog}
        onClose={() => {
          setShowRulesDialog(false)
          setSelectedContestForRules(null)
        }}
      />
    </div>
  )
}
