"use client"

import { useState } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import { MaterialInput } from "@/components/ui/material-input"
import {
  Trophy,
  Medal,
  Crown,
  ArrowLeft,
  Search,
  TrendingUp,
  Target,
  Award,
  Filter,
  ChevronDown,
  Star,
  Zap,
  Calendar,
  RefreshCwIcon as Refresh,
  Share,
  Plus,
  Diamond,
  Sparkles,
  TrendingDown,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

// Mock data for leaderboard
const mockUsers = [
  {
    id: 1,
    username: "CodeMaster2024",
    name: "Arjun Sharma",
    totalScore: 8450,
    rank: 1,
    contestsParticipated: 24,
    contestsWon: 8,
    winRate: 33,
    streak: 15,
    avatar: "A",
    isCurrentUser: false,
    recentActivity: "2 hours ago",
    tier: "Diamond",
    monthlyGrowth: 12,
  },
  {
    id: 2,
    username: "TechNinja",
    name: "Priya Patel",
    totalScore: 7920,
    rank: 2,
    contestsParticipated: 22,
    contestsWon: 6,
    winRate: 27,
    streak: 12,
    avatar: "P",
    isCurrentUser: false,
    recentActivity: "5 hours ago",
    tier: "Diamond",
    monthlyGrowth: 8,
  },
  {
    id: 3,
    username: "AlgoExpert",
    name: "Rahul Kumar",
    totalScore: 7680,
    rank: 3,
    contestsParticipated: 28,
    contestsWon: 7,
    winRate: 25,
    streak: 8,
    avatar: "R",
    isCurrentUser: false,
    recentActivity: "1 day ago",
    tier: "Diamond",
    monthlyGrowth: 15,
  },
  {
    id: 4,
    username: "DevQueen",
    name: "Sneha Singh",
    totalScore: 6540,
    rank: 4,
    contestsParticipated: 19,
    contestsWon: 4,
    winRate: 21,
    streak: 10,
    avatar: "S",
    isCurrentUser: false,
    recentActivity: "3 hours ago",
    tier: "Platinum",
    monthlyGrowth: 5,
  },
  {
    id: 5,
    username: "CodeCrusher",
    name: "Austin Dsouza",
    totalScore: 3200,
    rank: 47,
    contestsParticipated: 12,
    contestsWon: 1,
    winRate: 8,
    streak: 3,
    avatar: "A",
    isCurrentUser: true,
    recentActivity: "Just now",
    tier: "Gold",
    monthlyGrowth: -2,
  },
  // Add more mock users
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 6,
    username: `User${i + 6}`,
    name: `Developer ${i + 6}`,
    totalScore: Math.floor(Math.random() * 5000) + 1000,
    rank: i + 6,
    contestsParticipated: Math.floor(Math.random() * 20) + 5,
    contestsWon: Math.floor(Math.random() * 5),
    winRate: Math.floor(Math.random() * 30) + 10,
    streak: Math.floor(Math.random() * 20),
    avatar: `U${i + 6}`,
    isCurrentUser: false,
    recentActivity: `${Math.floor(Math.random() * 24)} hours ago`,
    tier: ["Gold", "Silver", "Bronze"][Math.floor(Math.random() * 3)],
    monthlyGrowth: Math.floor(Math.random() * 20) - 10,
  })),
]

const currentUser = mockUsers.find((user) => user.isCurrentUser)!

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />
    return <span className="md-subtitle-1 font-medium text-gray-600">#{rank}</span>
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600"
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500"
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-amber-600"
    if (rank <= 10) return "bg-gradient-to-r from-blue-500 to-blue-700"
    if (rank <= 50) return "bg-gradient-to-r from-blue-400 to-cyan-600"
    return "bg-gradient-to-r from-gray-400 to-gray-600"
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Diamond":
        return <Diamond className="h-4 w-4 text-blue-500" />
      case "Platinum":
        return <Medal className="h-4 w-4 text-gray-500" />
      case "Gold":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "Silver":
        return <Award className="h-4 w-4 text-gray-400" />
      default:
        return <Star className="h-4 w-4 text-orange-500" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Diamond":
        return "text-blue-600 bg-blue-50"
      case "Platinum":
        return "text-gray-600 bg-gray-50"
      case "Gold":
        return "text-yellow-600 bg-yellow-50"
      case "Silver":
        return "text-gray-500 bg-gray-50"
      default:
        return "text-orange-600 bg-orange-50"
    }
  }

  // Performance stats
  const performanceStats = [
    {
      icon: Trophy,
      label: "Total Score",
      value: currentUser?.totalScore?.toLocaleString() || "0",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Target,
      label: "Contests Won",
      value: currentUser?.contestsWon || 0,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Zap,
      label: "Win Rate",
      value: `${currentUser?.winRate || 0}%`,
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Calendar,
      label: "Current Streak",
      value: `${currentUser?.streak || 0} days`,
      color: "bg-red-100 text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Material Design App Bar */}
      <header className="bg-white md-elevation-2 sticky top-0 z-[var(--z-sticky)]">
        <div className="md-container">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <MaterialButton
                  variant="text"
                  size="medium"
                  startIcon={<ArrowLeft className="h-5 w-5" />}
                  className="text-gray-600"
                >
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </MaterialButton>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-full md-elevation-1">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="md-headline-6 text-gray-900">Leaderboard</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MaterialButton variant="text" size="medium" onClick={handleRefresh} loading={isLoading}>
                <Refresh className="h-5 w-5" />
              </MaterialButton>
              <MaterialButton variant="text" size="medium">
                <Share className="h-5 w-5" />
              </MaterialButton>
            </div>
          </nav>
        </div>
      </header>

      <div className="md-container py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Current User Highlight */}
          {currentUser && (
            <MaterialCard elevation={3} className="overflow-hidden md-fade-in">
              <div className="bg-gradient-to-r from-purple-600 to-blue-800 p-8 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center md-elevation-2">
                      <span className="md-headline-4 font-light text-white">{currentUser.avatar}</span>
                    </div>
                    <div>
                      <h2 className="md-headline-5 mb-2">Your Current Position</h2>
                      <p className="md-body-1 text-blue-100">
                        {currentUser.name} (@{currentUser.username})
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {getTierIcon(currentUser.tier)}
                        <span className="text-blue-100">{currentUser.tier} Tier</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start lg:items-end gap-4">
                    <div
                      className={`${getRankBadgeColor(currentUser.rank)} text-white px-6 py-3 rounded-full md-elevation-2`}
                    >
                      <div className="flex items-center gap-2">
                        {getRankIcon(currentUser.rank)}
                        <span className="md-subtitle-1 font-medium">Rank #{currentUser.rank}</span>
                      </div>
                    </div>
                    <div className="text-blue-100">
                      <span className="md-headline-5 font-medium text-white">{currentUser.totalScore}</span> points
                    </div>
                  </div>
                </div>
              </div>
            </MaterialCard>
          )}

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md-slide-up">
            {performanceStats.map((stat, index) => (
              <MaterialCard
                key={index}
                elevation={1}
                interactive
                className="p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="md-caption text-gray-600">{stat.label}</p>
                    <p className="md-headline-6 font-medium text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </MaterialCard>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="md-slide-up" style={{ animationDelay: "400ms" }}>
            <h3 className="md-headline-5 mb-6 text-center text-gray-900 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              Top Performers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {filteredUsers.slice(0, 3).map((user, index) => (
                <MaterialCard
                  key={user.id}
                  elevation={2}
                  interactive
                  className={`overflow-hidden transform transition-all duration-300 ${
                    index === 0 ? "md:order-2 md:scale-110" : index === 1 ? "md:order-1" : "md:order-3"
                  }`}
                >
                  <div className={`${getRankBadgeColor(user.rank)} p-6 text-white text-center`}>
                    <div className="flex justify-center mb-4">{getRankIcon(user.rank)}</div>
                    <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="md-headline-6 font-medium text-white">{user.avatar}</span>
                    </div>
                    <h4 className="md-subtitle-1 font-medium mb-1">{user.name}</h4>
                    <p className="md-body-2 opacity-90">@{user.username}</p>
                    <div className="flex items-center justify-center gap-1 mt-2 bg-white/20 rounded-full px-3 py-1">
                      {getTierIcon(user.tier)}
                      <span className="text-xs">{user.tier}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <p className="md-headline-4 font-medium text-gray-900 mb-1">{user.totalScore}</p>
                      <p className="md-caption text-gray-600">Total Points</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <p className="md-subtitle-2 font-medium text-green-600">{user.contestsWon}</p>
                        <p className="md-caption text-gray-600">Wins</p>
                      </div>
                      <div>
                        <p className="md-subtitle-2 font-medium text-blue-600">{user.contestsParticipated}</p>
                        <p className="md-caption text-gray-600">Contests</p>
                      </div>
                    </div>
                  </div>
                </MaterialCard>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <MaterialCard elevation={1} className="p-6 md-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <MaterialInput
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startIcon={<Search className="h-5 w-5" />}
                />
              </div>
              <div className="flex gap-3">
                <MaterialButton
                  variant="outlined"
                  onClick={() => setShowFilters(!showFilters)}
                  endIcon={<ChevronDown className="h-4 w-4" />}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </MaterialButton>
              </div>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  {["all", "diamond", "platinum", "gold", "silver"].map((tier) => (
                    <MaterialButton key={tier} variant="outlined" size="small" className="capitalize">
                      {tier === "all" ? "All Tiers" : tier}
                    </MaterialButton>
                  ))}
                </div>
              </div>
            )}
          </MaterialCard>

          {/* Full Rankings */}
          <MaterialCard elevation={2} className="overflow-hidden md-slide-up" style={{ animationDelay: "600ms" }}>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <h3 className="md-subtitle-1 font-medium text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                Rankings
              </h3>
              <p className="md-body-2 text-gray-600 mt-1">Complete leaderboard with detailed statistics</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left md-overline text-gray-500">Rank</th>
                    <th className="px-6 py-4 text-left md-overline text-gray-500">User</th>
                    <th className="px-6 py-4 text-left md-overline text-gray-500">Score</th>
                    <th className="px-6 py-4 text-left md-overline text-gray-500">Contests</th>
                    <th className="px-6 py-4 text-left md-overline text-gray-500">Win Rate</th>
                    <th className="px-6 py-4 text-left md-overline text-gray-500">Growth</th>
                    <th className="px-6 py-4 text-left md-overline text-gray-500">Activity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        user.isCurrentUser ? "bg-blue-50 border-l-4 border-blue-500" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getRankIcon(user.rank)}
                          {user.isCurrentUser && <Star className="h-4 w-4 text-blue-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-purple-500 to-blue-700 w-10 h-10 rounded-full flex items-center justify-center">
                            <span className="md-body-2 font-medium text-white">{user.avatar}</span>
                          </div>
                          <div>
                            <div className="md-body-2 font-medium text-gray-900 flex items-center gap-2">
                              {user.name}
                              {user.isCurrentUser && (
                                <MaterialBadge variant="primary" size="small">
                                  You
                                </MaterialBadge>
                              )}
                              <div
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getTierColor(user.tier)}`}
                              >
                                {getTierIcon(user.tier)}
                                <span>{user.tier}</span>
                              </div>
                            </div>
                            <div className="md-caption text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="md-subtitle-1 font-medium text-gray-900">{user.totalScore}</div>
                        <div className="md-caption text-gray-500">points</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="md-body-2 font-medium text-gray-900">
                            {user.contestsWon}/{user.contestsParticipated}
                          </span>
                          <span className="md-caption text-gray-500">won/total</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="md-body-2 font-medium text-gray-900">{user.winRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {user.monthlyGrowth > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : user.monthlyGrowth < 0 ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                          <span
                            className={`md-body-2 font-medium ${
                              user.monthlyGrowth > 0
                                ? "text-green-600"
                                : user.monthlyGrowth < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {user.monthlyGrowth > 0 ? "+" : ""}
                            {user.monthlyGrowth}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="md-caption text-gray-500">{user.recentActivity}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MaterialCard>

          {/* Performance Insights */}
          {currentUser && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md-slide-up" style={{ animationDelay: "700ms" }}>
              <MaterialCard elevation={1} className="p-6">
                <h4 className="md-subtitle-1 font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Your Progress
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      label: "Contest Participation",
                      current: currentUser.contestsParticipated,
                      total: 30,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Contests Won",
                      current: currentUser.contestsWon,
                      total: 10,
                      color: "bg-green-500",
                    },
                    {
                      label: "Current Streak",
                      current: currentUser.streak,
                      total: 30,
                      color: "bg-orange-500",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between md-body-2 mb-2">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium">
                          {item.current}/{item.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min((item.current / item.total) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </MaterialCard>

              <MaterialCard elevation={1} className="p-6">
                <h4 className="md-subtitle-1 font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Next Milestone
                </h4>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-100 to-blue-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-12 w-12 text-purple-600" />
                  </div>
                  <h5 className="md-subtitle-1 font-medium text-gray-900 mb-2">Reach Top 40</h5>
                  <p className="md-body-2 text-gray-600 mb-4">
                    You need <span className="font-medium text-purple-600">340 more points</span> to climb to rank #40
                  </p>
                  <div className="bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-700 h-3 rounded-full transition-all duration-300"
                      style={{ width: "35%" }}
                    ></div>
                  </div>
                  <p className="md-caption text-gray-500">35% progress to next milestone</p>
                </div>
              </MaterialCard>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <MaterialButton className="md-fab" variant="contained">
        <Plus className="h-6 w-6" />
      </MaterialButton>
    </div>
  )
}
