"use client"

import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ContestRulesDialog({
  contest,
  isOpen,
  onClose,
}: {
  contest: any
  isOpen: boolean
  onClose: () => void
}) {
  if (!contest) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Contest Rules
          </DialogTitle>
          <DialogDescription>Important guidelines for "{contest.title}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <MaterialCard elevation={1} className="p-4 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-3">Contest Overview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-800">Duration:</span>
                <span className="font-medium text-blue-900">{contest.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Difficulty:</span>
                <span className="font-medium text-blue-900 capitalize">{contest.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Type:</span>
                <span className="font-medium text-blue-900 uppercase">{contest.type}</span>
              </div>
            </div>
          </MaterialCard>

          {contest.rules && (
            <MaterialCard elevation={1} className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Contest Rules</h4>
              <div className="space-y-3">
                {contest.rules.map((rule: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 flex-1">{rule}</p>
                  </div>
                ))}
              </div>
            </MaterialCard>
          )}

          <MaterialCard elevation={1} className="p-4 bg-yellow-50">
            <h4 className="font-medium text-yellow-900 mb-3">General Guidelines</h4>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>• Ensure stable internet connection throughout the contest</p>
              <p>• Submit solutions before the time limit expires</p>
              <p>• Contact support if you encounter technical issues</p>
              <p>• Fair play is expected from all participants</p>
              <p>• Results will be announced after contest completion</p>
            </div>
          </MaterialCard>

          <MaterialButton onClick={onClose} fullWidth>
            I Understand
          </MaterialButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
