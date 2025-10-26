"use client"

import { useState } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialInput } from "@/components/ui/material-input"
import { Code2, Users, ArrowRight, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function JoinContestPage() {
  const [invitationCode, setInvitationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleJoinContest = async () => {
    if (!invitationCode.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo, redirect to lobby with the code
    router.push(`/lobby/${invitationCode.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white md-elevation-2 sticky top-0 z-[var(--z-sticky)]">
        <div className="md-container">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-full md-elevation-1">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="md-headline-6 text-gray-900">Codarena</span>
            </Link>

            {/* Back to Home Button */}
            <Link href="/">
              <MaterialButton
                variant="outlined"
                size="medium"
                startIcon={<Home className="h-4 w-4" />}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Back to Home
              </MaterialButton>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="md-container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="md-headline-3 text-gray-900 mb-4">Join a Contest</h1>
            <p className="md-body-1 text-gray-600 max-w-xl mx-auto">
              Enter an invitation code to join a contest lobby and compete with other participants.
            </p>
          </div>

          {/* Join Form */}
          <div className="space-y-8">
            <MaterialCard elevation={2} className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="md-headline-6 text-gray-900 mb-2">Enter Contest Code</h2>
                  <p className="md-body-2 text-gray-600">Have an invitation code? Enter it below to join instantly.</p>
                </div>

                <div>
                  <label className="md-subtitle-1 font-medium text-gray-900 mb-3 block">Invitation Code</label>
                  <MaterialInput
                    type="text"
                    placeholder="Enter invitation code (e.g., PRACTICE-DSA-2024)"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                    className="text-center font-mono text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Codes are case-insensitive and will be automatically formatted
                  </p>
                </div>

                <MaterialButton
                  fullWidth
                  size="large"
                  onClick={handleJoinContest}
                  disabled={!invitationCode.trim() || isLoading}
                  startIcon={isLoading ? undefined : <ArrowRight className="h-5 w-5" />}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Joining Contest...
                    </div>
                  ) : (
                    "Join Contest"
                  )}
                </MaterialButton>
              </div>
            </MaterialCard>

            {/* Quick Instructions */}
            <MaterialCard elevation={1} className="p-6 bg-blue-50 border border-blue-200">
              <h3 className="md-subtitle-1 font-medium text-blue-900 mb-3">How to Join</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </div>
                  <p>Get an invitation code from a contest organizer or friend</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </div>
                  <p>Enter the code in the input field above</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </div>
                  <p>Click "Join Contest" to enter the contest lobby</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                    4
                  </div>
                  <p>Wait for the contest to start and compete with others!</p>
                </div>
              </div>
            </MaterialCard>

            {/* Additional Help */}
            <MaterialCard elevation={1} className="p-6 bg-green-50 border border-green-200">
              <h3 className="md-subtitle-1 font-medium text-green-900 mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>• Don't have an invitation code? Browse available contests on the home page</p>
                <p>• Codes are usually shared by contest organizers or friends</p>
                <p>• Some contests may require entry fees while others are free to join</p>
                <p>• Contact support if you're having trouble joining a contest</p>
              </div>
              <div className="mt-4">
                <Link href="/">
                  <MaterialButton
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowLeft className="h-4 w-4" />}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    Browse All Contests
                  </MaterialButton>
                </Link>
              </div>
            </MaterialCard>
          </div>
        </div>
      </div>
    </div>
  )
}
