"use client"

import { useState, useEffect } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialCard } from "@/components/ui/material-card"
import { MaterialBadge } from "@/components/ui/material-badge"
import {
  Code2,
  Timer,
  Send,
  Play,
  Save,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Eye,
  EyeOff,
  Lightbulb,
  ArrowLeft,
  Camera,
  Mic,
  Monitor,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { contestMonitoring } from "@/lib/contest-monitoring"

// Warning Dialog Components
export function FullscreenWarningDialog({
  isOpen,
  onClose,
  onReenterFullscreen,
}: {
  isOpen: boolean
  onClose: () => void
  onReenterFullscreen: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[var(--z-modal)] mx-auto my-auto transform -translate-y-20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-6 w-6" />
            Fullscreen Violation Detected
          </DialogTitle>
          <DialogDescription>
            You have exited fullscreen mode during the contest. This is not allowed and may result in disqualification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm">
                <h5 className="font-medium text-red-800 mb-1">Warning</h5>
                <p className="text-red-700">
                  Exiting fullscreen mode during the contest is considered a violation of contest rules. 
                  Please return to fullscreen mode immediately to continue.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <MaterialButton
              variant="outlined"
              onClick={onClose}
              className="flex-1"
            >
              Continue Anyway
            </MaterialButton>
            <MaterialButton
              variant="contained"
              onClick={onReenterFullscreen}
              className="flex-1 bg-red-600 hover:bg-red-700"
              startIcon={<Maximize2 className="h-4 w-4" />}
            >
              Return to Fullscreen
            </MaterialButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function FaceDetectionWarningDialog({
  isOpen,
  onClose,
  onDismiss,
}: {
  isOpen: boolean
  onClose: () => void
  onDismiss: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[calc(var(--z-modal)+1)] mx-auto my-auto transform -translate-y-20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-orange-600">
            <Camera className="h-6 w-6" />
            Face Not Detected
          </DialogTitle>
          <DialogDescription>
            We cannot detect your face in the camera. Please ensure you are visible in the camera frame.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Camera className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <h5 className="font-medium text-orange-800 mb-1">Camera Monitoring</h5>
                <p className="text-orange-700">
                  Please ensure your face is clearly visible in the camera. 
                  This helps us maintain contest integrity and prevent cheating.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <MaterialButton
              variant="outlined"
              onClick={onDismiss}
              className="flex-1"
            >
              Dismiss Warning
            </MaterialButton>
            <MaterialButton
              variant="contained"
              onClick={onClose}
              className="flex-1"
            >
              I'm Ready
            </MaterialButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function VoiceDetectionWarningDialog({
  isOpen,
  onClose,
  onDismiss,
}: {
  isOpen: boolean
  onClose: () => void
  onDismiss: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[calc(var(--z-modal)+2)] mx-auto my-auto transform -translate-y-20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-purple-600">
            <Mic className="h-6 w-6" />
            Voice Activity Detected
          </DialogTitle>
          <DialogDescription>
            We have detected voice activity. Please ensure you are not communicating with others during the contest.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Mic className="h-4 w-4 text-purple-600 mt-0.5" />
              <div className="text-sm">
                <h5 className="font-medium text-purple-800 mb-1">Audio Monitoring</h5>
                <p className="text-purple-700">
                  Voice activity has been detected. Please ensure you are not communicating with others 
                  or receiving external help during the contest.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <MaterialButton
              variant="outlined"
              onClick={onDismiss}
              className="flex-1"
            >
              Dismiss Warning
            </MaterialButton>
            <MaterialButton
              variant="contained"
              onClick={onClose}
              className="flex-1"
            >
              I Understand
            </MaterialButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Monitoring Status Component
export function MonitoringStatus({
  isMonitoring,
  violations,
}: {
  isMonitoring: boolean
  violations: {
    fullscreen: number
    face: number
    voice: number
  }
}) {
  if (!isMonitoring) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <MaterialCard elevation={2} className="p-3 bg-white border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Monitoring Active</span>
          </div>
          
          {violations.fullscreen > 0 && (
            <MaterialBadge variant="error" size="small">
              FS: {violations.fullscreen}
            </MaterialBadge>
          )}
          
          {violations.face > 0 && (
            <MaterialBadge variant="warning" size="small">
              Face: {violations.face}
            </MaterialBadge>
          )}
          
          {violations.voice > 0 && (
            <MaterialBadge variant="secondary" size="small">
              Voice: {violations.voice}
            </MaterialBadge>
          )}
        </div>
      </MaterialCard>
    </div>
  )
}
