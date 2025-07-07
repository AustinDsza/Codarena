"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import {
  User,
  Trophy,
  Target,
  Award,
  TrendingUp,
  Users,
  UserPlus,
  Heart,
  Star,
  Crown,
  Zap,
  Code,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Medal,
  Gift,
  Flame,
  Diamond,
  Users2,
  Eye,
  ArrowLeft,
} from "lucide-react"

// Demo user data
const demoUser = {
  id: "demo-user-123",
  name: "User Profile",
  username: "@userprofile",
  email: "user@codarena.com",
  bio: "Full-stack developer passionate about competitive programming. Love solving complex algorithms and building scalable applications. Always up for a coding challenge!",
  avatar: "/placeholder.svg?height=120&width=120",
  joinDate: "2023-06-15",
  rank: "Gold",
  globalRank: 247,
  points: 2847,
  streak: 12,
  problemsSolved: 89,
  contestsWon: 5,
  totalEarnings: 15750,
  contestPoints: 1850,
  followers: 156,
  following: 89,
  friends: 42,
}

// Demo submissions data
const demoSubmissions = [
  {
    id: 1,
    problemTitle: "Two Sum Array Challenge",
    difficulty: "Easy",
    language: "Python",
    status: "Accepted",
    time: "45ms",
    memory: "14.2MB",
    submittedAt: "2024-01-15T10:30:00Z",
    points: 100,
  },
  {
    id: 2,
    problemTitle: "Binary Tree Maximum Path",
    difficulty: "Hard",
    language: "JavaScript",
    status: "Accepted",
    time: "128ms",
    memory: "18.7MB",
    submittedAt: "2024-01-15T09:15:00Z",
    points: 300,
  },
  {
    id: 3,
    problemTitle: "Dynamic Programming Stairs",
    difficulty: "Medium",
    language: "Java",
    status: "Wrong Answer",
    time: "89ms",
    memory: "16.1MB",
    submittedAt: "2024-01-14T16:45:00Z",
    points: 0,
  },
  {
    id: 4,
    problemTitle: "Graph Shortest Path",
    difficulty: "Medium",
    language: "C++",
    status: "Accepted",
    time: "67ms",
    memory: "12.8MB",
    submittedAt: "2024-01-14T14:20:00Z",
    points: 200,
  },
]

// Demo achievements data
const demoAchievements = [
  {
    id: 1,
    title: "Speed Demon",
    description: "Solved 10 problems in under 5 minutes each",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-yellow-100 text-yellow-800",
    earnedAt: "2024-01-10",
    points: 150,
  },
  {
    id: 2,
    title: "Streak Master",
    description: "Maintained a 10-day solving streak",
    icon: <Flame className="h-6 w-6" />,
    color: "bg-orange-100 text-orange-800",
    earnedAt: "2024-01-08",
    points: 200,
  },
  {
    id: 3,
    title: "Contest Winner",
    description: "Won first place in a coding contest",
    icon: <Crown className="h-6 w-6" />,
    color: "bg-purple-100 text-purple-800",
    earnedAt: "2024-01-05",
    points: 500,
  },
  {
    id: 4,
    title: "Problem Solver",
    description: "Solved 50+ coding problems",
    icon: <Target className="h-6 w-6" />,
    color: "bg-green-100 text-green-800",
    earnedAt: "2024-01-01",
    points: 300,
  },
]

// Demo activity data
const demoActivity = [
  {
    id: 1,
    type: "contest_win",
    title: "Won Logic Masters Contest",
    description: "Placed 1st out of 234 participants",
    points: 500,
    timestamp: "2024-01-15T08:00:00Z",
    icon: <Trophy className="h-5 w-5 text-yellow-600" />,
  },
  {
    id: 2,
    type: "problem_solved",
    title: "Solved Binary Tree Challenge",
    description: "Hard difficulty problem completed",
    points: 300,
    timestamp: "2024-01-14T15:30:00Z",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
  },
  {
    id: 3,
    type: "streak_milestone",
    title: "12-Day Streak Achieved",
    description: "Consistent daily problem solving",
    points: 100,
    timestamp: "2024-01-14T12:00:00Z",
    icon: <Flame className="h-5 w-5 text-orange-600" />,
  },
  {
    id: 4,
    type: "badge_earned",
    title: "Speed Demon Badge Earned",
    description: "Fast problem solving achievement",
    points: 150,
    timestamp: "2024-01-13T10:15:00Z",
    icon: <Award className="h-5 w-5 text-purple-600" />,
  },
]

// Demo friends data
const demoFriends = [
  {
    id: 1,
    name: "Sarah Chen",
    username: "@sarahc",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: "Diamond",
    rankColor: "text-blue-600",
    isOnline: true,
    mutualFriends: 8,
  },
  {
    id: 2,
    name: "Mike Johnson",
    username: "@mikej",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: "Platinum",
    rankColor: "text-gray-600",
    isOnline: false,
    mutualFriends: 12,
  },
  {
    id: 3,
    name: "Emma Wilson",
    username: "@emmaw",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: "Gold",
    rankColor: "text-yellow-600",
    isOnline: true,
    mutualFriends: 5,
  },
  {
    id: 4,
    name: "David Lee",
    username: "@davidl",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: "Silver",
    rankColor: "text-gray-500",
    isOnline: true,
    mutualFriends: 3,
  },
]

// Demo followers data
const demoFollowers = [
  {
    id: 1,
    name: "Jessica Park",
    username: "@jessicap",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: "Gold",
    rankColor: "text-yellow-600",
    isOnline: false,
  },
  {
    id: 2,
    name: "Ryan Smith",
    username: "@ryans",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: "Platinum",
    rankColor: "text-gray-600",
    isOnline: true,
  },
  {
    id: 3,
    name: "Lisa Zhang",
    username: "@lisaz",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: "Diamond",
    rankColor: "text-blue-600",
    isOnline: true,
  },
]

// Demo following data
const demoFollowing = [
  {
    id: 1,
    name: "Kevin Wu",
    username: "@kevinw",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: "Diamond",
    rankColor: "text-blue-600",
    isOnline: true,
  },
  {
    id: 2,
    name: "Anna Rodriguez",
    username: "@annar",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: "Gold",
    rankColor: "text-yellow-600",
    isOnline: false,
  },
]

// Demo contest history
const demoContestHistory = [
  {
    id: 1,
    name: "Logic Masters Championship",
    date: "2024-01-15",
    rank: 1,
    participants: 234,
    points: 500,
    badge: "🥇",
  },
  {
    id: 2,
    name: "Algorithm Speed Run",
    date: "2024-01-12",
    rank: 15,
    participants: 189,
    points: 150,
    badge: null,
  },
  {
    id: 3,
    name: "Data Structure Challenge",
    date: "2024-01-08",
    rank: 3,
    participants: 156,
    points: 300,
    badge: "🥉",
  },
  {
    id: 4,
    name: "Weekly Coding Battle",
    date: "2024-01-05",
    rank: 8,
    participants: 98,
    points: 120,
    badge: null,
  },
  {
    id: 5,
    name: "New Year Code Fest",
    date: "2024-01-01",
    rank: 2,
    participants: 312,
    points: 450,
    badge: "🥈",
  },
]

// Demo ranking history
const demoRankingHistory = [
  {
    month: "Jan 2024",
    rank: 247,
    change: -12,
    contests: 5,
  },
  {
    month: "Dec 2023",
    rank: 259,
    change: 23,
    contests: 4,
  },
  {
    month: "Nov 2023",
    rank: 236,
    change: -8,
    contests: 6,
  },
  {
    month: "Oct 2023",
    rank: 244,
    change: 15,
    contests: 3,
  },
  {
    month: "Sep 2023",
    rank: 229,
    change: -5,
    contests: 7,
  },
  {
    month: "Aug 2023",
    rank: 234,
    change: 0,
    contests: 2,
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Diamond":
        return "text-blue-600"
      case "Platinum":
        return "text-gray-600"
      case "Gold":
        return "text-yellow-600"
      case "Silver":
        return "text-gray-500"
      default:
        return "text-gray-600"
    }
  }

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "Diamond":
        return <Diamond className="h-4 w-4" />
      case "Platinum":
        return <Medal className="h-4 w-4" />
      case "Gold":
        return <Crown className="h-4 w-4" />
      case "Silver":
        return <Award className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <MaterialButton variant="outlined" onClick={handleBackToHome} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </MaterialButton>
        </div>

        {/* Profile Header */}
        <MaterialCard elevation={2} className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={demoUser.avatar || "/placeholder.svg"}
                alt={demoUser.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-2">
                {getRankIcon(demoUser.rank)}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{demoUser.name}</h1>
                  <p className="text-gray-600 text-lg">{demoUser.username}</p>
                  <p className="text-gray-700 mt-2 max-w-2xl">{demoUser.bio}</p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <MaterialBadge
                    variant="default"
                    size="large"
                    className={`${getRankColor(demoUser.rank)} bg-yellow-100`}
                  >
                    {getRankIcon(demoUser.rank)}
                    <span className="ml-1">{demoUser.rank} Rank</span>
                  </MaterialBadge>
                  <div className="text-sm text-gray-600">
                    Global Rank: <span className="font-semibold">#{demoUser.globalRank}</span>
                  </div>
                </div>
              </div>

              {/* Social Stats */}
              <div className="flex gap-6 mt-6">
                <div className="text-center">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Users className="h-4 w-4" />
                    <span className="font-bold text-lg">{demoUser.followers}</span>
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 text-green-600">
                    <UserPlus className="h-4 w-4" />
                    <span className="font-bold text-lg">{demoUser.following}</span>
                  </div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Heart className="h-4 w-4" />
                    <span className="font-bold text-lg">{demoUser.friends}</span>
                  </div>
                  <div className="text-sm text-gray-600">Friends</div>
                </div>
              </div>
            </div>
          </div>
        </MaterialCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MaterialCard elevation={1} className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{demoUser.points.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </MaterialCard>

          <MaterialCard elevation={1} className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{demoUser.problemsSolved}</div>
            <div className="text-sm text-gray-600">Problems Solved</div>
          </MaterialCard>

          <MaterialCard elevation={1} className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{demoUser.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </MaterialCard>

          <MaterialCard elevation={1} className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">₹{demoUser.totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </MaterialCard>
        </div>

        {/* Contest Performance Card */}
        <MaterialCard elevation={1} className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contest Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{demoUser.contestPoints}</div>
              <div className="text-sm text-purple-800">Contest Points</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">#{demoUser.globalRank}</div>
              <div className="text-sm text-yellow-800">Global Rank</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{demoUser.contestsWon}</div>
              <div className="text-sm text-green-800">Contests Won</div>
            </div>
          </div>
        </MaterialCard>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: <User className="h-4 w-4" /> },
                { id: "submissions", label: "Submissions", icon: <Code className="h-4 w-4" /> },
                { id: "contests", label: "Contests", icon: <Trophy className="h-4 w-4" /> },
                { id: "social", label: "Social", icon: <Users2 className="h-4 w-4" /> },
                { id: "ranking", label: "Ranking", icon: <TrendingUp className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <MaterialCard elevation={1} className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {demoActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-600 font-medium">+{activity.points} points</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </MaterialCard>

            {/* Achievements */}
            <MaterialCard elevation={1} className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                {demoAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${achievement.color}`}>{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-600 font-medium">+{achievement.points} points</span>
                        <span className="text-xs text-gray-500">Earned {formatDate(achievement.earnedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </MaterialCard>
          </div>
        )}

        {activeTab === "submissions" && (
          <MaterialCard elevation={1} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Easy: 45</span>
                <span>Medium: 32</span>
                <span>Hard: 12</span>
              </div>
            </div>
            <div className="space-y-4">
              {demoSubmissions.map((submission) => (
                <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">{submission.problemTitle}</h4>
                      <MaterialBadge
                        variant="default"
                        size="small"
                        className={
                          submission.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : submission.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {submission.difficulty}
                      </MaterialBadge>
                      <MaterialBadge variant="default" size="small" className="bg-blue-100 text-blue-800">
                        {submission.language}
                      </MaterialBadge>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.status === "Accepted" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span
                        className={`font-medium ${
                          submission.status === "Accepted" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Runtime: {submission.time}</span>
                    <span>Memory: {submission.memory}</span>
                    <span>Points: {submission.points}</span>
                    <span>{formatTimeAgo(submission.submittedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </MaterialCard>
        )}

        {activeTab === "contests" && (
          <MaterialCard elevation={1} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contest History</h3>
            <div className="space-y-4">
              {demoContestHistory.map((contest) => (
                <div key={contest.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">{contest.name}</h4>
                      {contest.badge && <span className="text-2xl">{contest.badge}</span>}
                    </div>
                    <div className="text-sm text-gray-600">{formatDate(contest.date)}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      Rank: <span className="font-medium">#{contest.rank}</span>
                    </span>
                    <span>Participants: {contest.participants}</span>
                    <span className="text-green-600 font-medium">+{contest.points} points</span>
                  </div>
                </div>
              ))}
            </div>
          </MaterialCard>
        )}

        {activeTab === "social" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Friends */}
            <MaterialCard elevation={1} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Friends ({demoUser.friends})</h3>
                <MaterialButton size="small" variant="outlined">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </MaterialButton>
              </div>
              <div className="space-y-3">
                {demoFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="relative">
                      <img
                        src={friend.avatar || "/placeholder.svg"}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{friend.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${friend.rankColor}`}>{friend.rank}</span>
                        <span className="text-xs text-gray-500">{friend.mutualFriends} mutual</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </MaterialCard>

            {/* Followers */}
            <MaterialCard elevation={1} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Followers ({demoUser.followers})</h3>
                <MaterialButton size="small" variant="outlined">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </MaterialButton>
              </div>
              <div className="space-y-3">
                {demoFollowers.map((follower) => (
                  <div key={follower.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="relative">
                      <img
                        src={follower.avatar || "/placeholder.svg"}
                        alt={follower.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {follower.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{follower.name}</p>
                      <span className={`text-xs ${follower.rankColor}`}>{follower.rank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </MaterialCard>

            {/* Following */}
            <MaterialCard elevation={1} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Following ({demoUser.following})</h3>
                <MaterialButton size="small" variant="outlined">
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </MaterialButton>
              </div>
              <div className="space-y-3">
                {demoFollowing.map((following) => (
                  <div key={following.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="relative">
                      <img
                        src={following.avatar || "/placeholder.svg"}
                        alt={following.name}
                        className="w-10 h-10 rounded-full"
                      />
                      {following.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{following.name}</p>
                      <span className={`text-xs ${following.rankColor}`}>{following.rank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </MaterialCard>
          </div>
        )}

        {activeTab === "ranking" && (
          <div className="space-y-8">
            {/* Current Ranking */}
            <MaterialCard elevation={1} className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Ranking</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">#{demoUser.globalRank}</div>
                  <div className="text-sm text-purple-800 mt-1">Global Rank</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{demoUser.contestPoints}</div>
                  <div className="text-sm text-blue-800 mt-1">Contest Points</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{demoUser.rank}</div>
                  <div className="text-sm text-green-800 mt-1">Current Tier</div>
                </div>
              </div>
            </MaterialCard>

            {/* Ranking History */}
            <MaterialCard elevation={1} className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Ranking History</h3>
              <div className="space-y-4">
                {demoRankingHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-900">{entry.month}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">#{entry.rank}</span>
                        {entry.change > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <ArrowUp className="h-4 w-4" />
                            <span className="text-sm font-medium">+{entry.change}</span>
                          </div>
                        )}
                        {entry.change < 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <ArrowDown className="h-4 w-4" />
                            <span className="text-sm font-medium">{entry.change}</span>
                          </div>
                        )}
                        {entry.change === 0 && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Minus className="h-4 w-4" />
                            <span className="text-sm font-medium">0</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.contests} contest{entry.contests !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </MaterialCard>
          </div>
        )}
      </div>
    </div>
  )
}
