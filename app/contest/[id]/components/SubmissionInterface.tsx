"use client"

import { useState } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialInput } from "@/components/ui/material-input"
import { Upload, LinkIcon, Send, Edit, Eye, Clock, CheckCircle, ExternalLink } from "lucide-react"

interface SubmissionData {
  url: string
  notes: string
  submittedAt: Date
}

export default function SubmissionInterface({ contest }: { contest: any }) {
  const [submissionUrl, setSubmissionUrl] = useState("")
  const [submissionNotes, setSubmissionNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(null)

  // Check if contest deadline has passed
  const isDeadlinePassed = () => {
    if (!contest.submissionTimeLeft) return false
    // For demo purposes, we'll simulate deadline logic
    // In real implementation, this would check against actual deadline
    return false
  }

  const handleSubmit = async () => {
    if (!submissionUrl.trim()) {
      alert("Please provide a submission URL")
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save submission data
    const newSubmission: SubmissionData = {
      url: submissionUrl,
      notes: submissionNotes,
      submittedAt: new Date(),
    }

    setSubmissionData(newSubmission)
    setIsSubmitting(false)
    setIsEditing(false)

    alert("Submission successful!")
  }

  const handleEditSubmission = () => {
    if (submissionData) {
      setSubmissionUrl(submissionData.url)
      setSubmissionNotes(submissionData.notes)
      setIsEditing(true)
    }
  }

  const handleUpdateSubmission = async () => {
    if (!submissionUrl.trim()) {
      alert("Please provide a submission URL")
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update submission data
    const updatedSubmission: SubmissionData = {
      url: submissionUrl,
      notes: submissionNotes,
      submittedAt: new Date(),
    }

    setSubmissionData(updatedSubmission)
    setIsSubmitting(false)
    setIsEditing(false)

    alert("Submission updated successfully!")
  }

  const handleCancelEdit = () => {
    if (submissionData) {
      setSubmissionUrl(submissionData.url)
      setSubmissionNotes(submissionData.notes)
    }
    setIsEditing(false)
  }

  // If user has submitted and not editing, show preview
  if (submissionData && !isEditing) {
    return (
      <MaterialCard elevation={1} className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Submission Preview
        </h3>

        <div className="space-y-4">
          {/* Submission Status */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Successfully Submitted</span>
            </div>
            <p className="text-sm text-green-700">
              Submitted on {submissionData.submittedAt.toLocaleDateString()} at{" "}
              {submissionData.submittedAt.toLocaleTimeString()}
            </p>
          </div>

          {/* Submission Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {contest.type === "ui-ux" ? "Design File URL" : "Project URL"}
              </label>
              <div className="flex items-center gap-2 p-2 bg-white rounded border">
                <LinkIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900 flex-1 truncate">{submissionData.url}</span>
                <a
                  href={submissionData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {submissionData.notes && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Additional Notes</label>
                <div className="p-2 bg-white rounded border text-sm text-gray-900">{submissionData.notes}</div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <MaterialButton
              onClick={handleEditSubmission}
              disabled={isDeadlinePassed()}
              variant="outlined"
              className="flex-1"
              startIcon={<Edit className="h-4 w-4" />}
            >
              {isDeadlinePassed() ? "Deadline Passed" : "Edit Submission"}
            </MaterialButton>
            <MaterialButton
              onClick={() => window.open(submissionData.url, "_blank")}
              variant="outlined"
              className="flex-1"
              startIcon={<Eye className="h-4 w-4" />}
            >
              View Submission
            </MaterialButton>
          </div>

          {/* Time Remaining Info */}
          {contest.submissionTimeLeft && !isDeadlinePassed() && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Time remaining to edit:
                </span>
                <span className="font-medium text-blue-900">{contest.submissionTimeLeft}</span>
              </div>
            </div>
          )}
        </div>
      </MaterialCard>
    )
  }

  // Show submission/edit form
  return (
    <MaterialCard elevation={1} className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5 text-blue-600" />
        {isEditing ? "Edit Your Submission" : "Submit Your Work"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {contest.type === "ui-ux" ? "Design File URL" : "Project URL"}
          </label>
          <MaterialInput
            placeholder={contest.type === "ui-ux" ? "https://figma.com/..." : "https://github.com/..."}
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            startIcon={<LinkIcon className="h-4 w-4" />}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Notes (Optional)</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Explain your approach, design decisions, or any special features..."
            value={submissionNotes}
            onChange={(e) => setSubmissionNotes(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          {isEditing && (
            <MaterialButton onClick={handleCancelEdit} variant="outlined" className="flex-1" disabled={isSubmitting}>
              Cancel
            </MaterialButton>
          )}
          <MaterialButton
            onClick={isEditing ? handleUpdateSubmission : handleSubmit}
            disabled={isSubmitting || !submissionUrl.trim()}
            className={`${isEditing ? "flex-1" : "w-full"}`}
            startIcon={
              isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isEditing ? (
                <Send className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )
            }
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Submitting..."
              : isEditing
                ? "Update Submission"
                : "Submit Work"}
          </MaterialButton>
        </div>

        {contest.submissionTimeLeft && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-800">Submissions remaining:</span>
              <span className="font-medium text-blue-900">
                {contest.maxSubmissions - contest.submissionCount} of {contest.maxSubmissions}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-blue-800">Time remaining:</span>
              <span className="font-medium text-blue-900">{contest.submissionTimeLeft}</span>
            </div>
          </div>
        )}
      </div>
    </MaterialCard>
  )
}
