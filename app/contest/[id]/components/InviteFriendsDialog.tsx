"use client"

import { useState } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialInput } from "@/components/ui/material-input"
import { Share2, CheckCircle, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function InviteFriendsDialog({
  contest,
  isOpen,
  onClose,
}: {
  contest: any
  isOpen: boolean
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  if (!contest) return null

  const contestUrl = `${window.location.origin}/contest/${contest.id}`
  const inviteMessage = `🚀 Join me in "${contest.title}"!\n\n${contest.description}\n\nContest Code: ${contest.inviteCode}\nDirect Link: ${contestUrl}\n\n#Codarena #CodingContest`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(contestUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(contest.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(inviteMessage)}`
    window.open(twitterUrl, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Share2 className="h-6 w-6 text-blue-600" />
            Invite Friends
          </DialogTitle>
          <DialogDescription>Share this contest with your friends and compete together!</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <MaterialCard elevation={1} className="p-4 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-2">{contest.title}</h4>
            <div className="space-y-1 text-sm">
              <p className="text-blue-800">Duration: {contest.duration}</p>
              <p className="text-blue-800">Difficulty: {contest.difficulty}</p>
              <p className="text-blue-800">
                {contest.prizeType === "cash" ? `Entry Fee: ₹${contest.entryFee}` : "Free Practice"}
              </p>
            </div>
          </MaterialCard>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Contest Code</label>
            <div className="flex gap-2">
              <MaterialInput value={contest.inviteCode} readOnly className="flex-1 font-mono" />
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={handleCopyCode}
                startIcon={copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              >
                {copied ? "Copied!" : "Copy"}
              </MaterialButton>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Direct Link</label>
            <div className="flex gap-2">
              <MaterialInput value={contestUrl} readOnly className="flex-1 text-sm" />
              <MaterialButton
                variant="outlined"
                size="medium"
                onClick={handleCopyLink}
                startIcon={copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              >
                {copied ? "Copied!" : "Copy"}
              </MaterialButton>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-3">
              <MaterialButton
                variant="outlined"
                onClick={handleShareWhatsApp}
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                WhatsApp
              </MaterialButton>
              <MaterialButton
                variant="outlined"
                onClick={handleShareTwitter}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                Twitter
              </MaterialButton>
            </div>
          </div>

          <MaterialButton onClick={onClose} fullWidth>
            Done
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
