"use client"

import { useState, useEffect } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import {
  Code2,
  Users,
  Trophy,
  Clock,
  Share2,
  Crown,
  Medal,
  Award,
  Play,
  Copy,
  CheckCircle,
  Timer,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock participant data
const generateMockParticipants = () => [
  {
    id: 1,
    username: "CodeNinja",
    rank: 1,
    score: 2850,
    status: "ready",
    avatar: "🥇",
    joinedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 2,
    username: "AlgoMaster",
    rank: 2,
    score: 2720,
    status: "ready",
    avatar: "🥈",
    joinedAt: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: 3,
    username: "DevGuru",
    rank: 3,
    score: 2650,
    status: "ready",
    avatar: "🥉",
    joinedAt: new Date(Date.now() - 20 * 60 * 1000),
  },
  {
    id: 4,
    username: "ByteWarrior",
    rank: 4,
    score: 2580,
    status: "waiting",
    avatar: "⚡",
    joinedAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 5,
    username: "CodeCrusher",
    rank: 5,
    score: 2520,
    status: "ready",
    avatar: "🔥",
    joinedAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: 6,
    username: "LogicLord",
    rank: 6,
    score: 2480,
    status: "waiting",
    avatar: "🧠",
    joinedAt: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: 7,
    username: "DataDragon",
    rank: 7,
    score: 2420,
    status: "ready",
    avatar: "🐉",
    joinedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 8,
    username: "StackSage",
    rank: 8,
    score: 2380,
    status: "ready",
    avatar: "📚",
    joinedAt: new Date(Date.now() - 3 * 60 * 1000),
  },
]

export default function ContestLobbyPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [participants, setParticipants] = useState(generateMockParticipants())
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [timeUntilStart, setTimeUntilStart] = useState(15 * 60) // 15 minutes in seconds
  const [copied, setCopied] = useState(false)

  // Mock contest data based on code
  const contestData = {
    title:
      code === "PRACTICE-DSA-2024"
        ? "🎯 DSA Practice Arena"
        : code === "LOGIC-QUIZ-2024"
          ? "🧠 Logic Warm-up Challenge"
          : "🌟 Contest Lobby",
    description: "Practice algorithmic problems with zero pressure and instant feedback.",
    type: "dsa",
    difficulty: "beginner",
    duration: "1 hour",
    maxParticipants: 500,
    category: "practice",
  }

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilStart((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate real-time participant updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          status: Math.random() > 0.8 ? (p.status === "ready" ? "waiting" : "ready") : p.status,
        })),
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const readyParticipants = participants.filter((p) => p.status === "ready").length
  const waitingParticipants = participants.filter((p) => p.status === "waiting").length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white md-elevation-2 sticky top-0 z-50">
        <div className="md-container">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-full md-elevation-1">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="md-headline-6 text-gray-900">Codarena</span>
            </Link>
            <MaterialBadge variant="primary" size="medium" className="font-mono">
              {code}
            </MaterialBadge>
          </nav>
        </div>
      </header>

      <div className="md-container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Contest Header */}
          <MaterialCard elevation={2} className="p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1">
                <h1 className="md-headline-4 text-gray-900 mb-2">{contestData.title}</h1>
                <p className="md-body-1 text-gray-600 mb-4">{contestData.description}</p>
                <div className="flex flex-wrap gap-3">
                  <MaterialBadge variant="default" size="medium">
                    {contestData.difficulty}
                  </MaterialBadge>
                  <MaterialBadge variant="success" size="medium">
                    FREE
                  </MaterialBadge>
                  <MaterialBadge variant="default" size="medium">
                    {contestData.duration}
                  </MaterialBadge>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-3">
                  <Timer className="h-8 w-8 text-blue-600" />
                </div>
                <p className="md-body-2 text-gray-600 mb-1">Starts in</p>
                <p className="md-headline-5 font-bold text-blue-600 font-mono">{formatTime(timeUntilStart)}</p>
              </div>
            </div>
          </MaterialCard>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Participants List */}
            <div className="lg:col-span-2">
              <MaterialCard elevation={2} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-600" />
                    <h2 className="md-headline-6 text-gray-900">Participants</h2>
                    <MaterialBadge variant="default" size="medium">
                      {participants.length}/{contestData.maxParticipants}
                    </MaterialBadge>
                  </div>
                  <MaterialButton
                    variant="outlined"
                    size="small"
                    startIcon={copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    onClick={handleCopyCode}
                    className={copied ? "border-green-500 text-green-600" : ""}
                  >
                    {copied ? "Copied!" : "Share Code"}
                  </MaterialButton>
                </div>

                {/* Status Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <MaterialCard elevation={0} className="p-4 bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="md-subtitle-2 font-medium text-green-800">Ready</p>
                        <p className="md-headline-6 font-bold text-green-600">{readyParticipants}</p>
                      </div>
                    </div>
                  </MaterialCard>
                  <MaterialCard elevation={0} className="p-4 bg-orange-50 border border-orange-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="md-subtitle-2 font-medium text-orange-800">Waiting</p>
                        <p className="md-headline-6 font-bold text-orange-600">{waitingParticipants}</p>
                      </div>
                    </div>
                  </MaterialCard>
                </div>

                {/* Participants Grid */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedParticipant(participant)
                        setShowParticipantModal(true)
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{participant.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="md-subtitle-1 font-medium text-gray-900">{participant.username}</span>
                            {participant.rank <= 3 && (
                              <div className="flex">
                                {participant.rank === 1 && <Crown className="h-4 w-4 text-yellow-600" />}
                                {participant.rank === 2 && <Medal className="h-4 w-4 text-gray-400" />}
                                {participant.rank === 3 && <Award className="h-4 w-4 text-amber-600" />}
                              </div>
                            )}
                          </div>
                          <p className="md-body-2 text-gray-600">
                            Rank #{participant.rank} • Score: {participant.score}
                          </p>
                        </div>
                      </div>
                      <MaterialBadge variant={participant.status === "ready" ? "success" : "warning"} size="small">
                        {participant.status}
                      </MaterialBadge>
                    </div>
                  ))}
                </div>
              </MaterialCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leaderboard Preview */}
              <MaterialCard elevation={2} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <h3 className="md-subtitle-1 font-medium text-gray-900">Top Performers</h3>
                </div>
                <div className="space-y-3">
                  {participants.slice(0, 3).map((participant, index) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <div className="text-lg">{participant.avatar}</div>
                      <div className="flex-1">
                        <p className="md-body-2 font-medium text-gray-900">{participant.username}</p>
                        <p className="md-caption text-gray-600">Score: {participant.score}</p>
                      </div>
                      <MaterialBadge variant="default" size="small">
                        #{participant.rank}
                      </MaterialBadge>
                    </div>
                  ))}
                </div>
              </MaterialCard>

              {/* Contest Actions */}
              <MaterialCard elevation={2} className="p-6">
                <h3 className="md-subtitle-1 font-medium text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <MaterialButton
                    fullWidth
                    size="medium"
                    startIcon={<Play className="h-5 w-5" />}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={timeUntilStart > 0}
                  >
                    {timeUntilStart > 0 ? `Starts in ${formatTime(timeUntilStart)}` : "Start Contest"}
                  </MaterialButton>

                  <MaterialButton
                    variant="outlined"
                    fullWidth
                    startIcon={<Share2 className="h-4 w-4" />}
                    onClick={handleCopyCode}
                  >
                    Invite Friends
                  </MaterialButton>

                  <MaterialButton variant="text" fullWidth startIcon={<Target className="h-4 w-4" />}>
                    View Contest Rules
                  </MaterialButton>
                </div>
              </MaterialCard>

              {/* Contest Stats */}
              <MaterialCard elevation={2} className="p-6">
                <h3 className="md-subtitle-1 font-medium text-gray-900 mb-4">Contest Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="md-body-2 text-gray-600">Total Participants</span>
                    <span className="md-body-2 font-medium">{participants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="md-body-2 text-gray-600">Ready to Start</span>
                    <span className="md-body-2 font-medium text-green-600">{readyParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="md-body-2 text-gray-600">Average Score</span>
                    <span className="md-body-2 font-medium">
                      {Math.round(participants.reduce((sum, p) => sum + p.score, 0) / participants.length)}
                    </span>
                  </div>
                </div>
              </MaterialCard>
            </div>
          </div>
        </div>
      </div>

      {/* Participant Details Modal */}
      <Dialog open={showParticipantModal} onOpenChange={setShowParticipantModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-2xl">{selectedParticipant?.avatar}</span>
              {selectedParticipant?.username}
            </DialogTitle>
            <DialogDescription>Participant details and statistics</DialogDescription>
          </DialogHeader>

          {selectedParticipant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MaterialCard elevation={0} className="p-3 text-center bg-blue-50">
                  <p className="md-caption text-gray-600">Current Rank</p>
                  <p className="md-headline-6 font-bold text-blue-600">#{selectedParticipant.rank}</p>
                </MaterialCard>
                <MaterialCard elevation={0} className="p-3 text-center bg-green-50">
                  <p className="md-caption text-gray-600">Score</p>
                  <p className="md-headline-6 font-bold text-green-600">{selectedParticipant.score}</p>
                </MaterialCard>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="md-body-2 text-gray-600">Status</span>
                  <MaterialBadge variant={selectedParticipant.status === "ready" ? "success" : "warning"} size="small">
                    {selectedParticipant.status}
                  </MaterialBadge>
                </div>
                <div className="flex justify-between">
                  <span className="md-body-2 text-gray-600">Joined</span>
                  <span className="md-body-2 font-medium">{selectedParticipant.joinedAt.toLocaleTimeString()}</span>
                </div>
              </div>

              <MaterialButton fullWidth onClick={() => setShowParticipantModal(false)}>
                Close
              </MaterialButton>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
