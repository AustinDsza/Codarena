"use client"

import { Coins } from "lucide-react"

// Monitoring service for contest security
export class ContestMonitoringService {
  private videoStream: MediaStream | null = null
  private audioStream: MediaStream | null = null
  private isMonitoring = false
  private faceDetectionInterval: NodeJS.Timeout | null = null
  private voiceDetectionInterval: NodeJS.Timeout | null = null
  private fullscreenCheckInterval: NodeJS.Timeout | null = null
  private videoElement: HTMLVideoElement | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private microphone: MediaStreamAudioSourceNode | null = null
  private dataArray: Uint8Array | null = null

  // Callbacks for violations
  private onFaceNotDetected?: () => void
  private onVoiceDetected?: () => void
  private onFullscreenExit?: () => void
  private onPermissionsGranted?: () => void

  constructor() {
    this.setupVideoElement()
  }

  private setupVideoElement() {
    // Create a hidden video element for face detection
    this.videoElement = document.createElement('video')
    this.videoElement.style.position = 'fixed'
    this.videoElement.style.top = '-9999px'
    this.videoElement.style.left = '-9999px'
    this.videoElement.style.width = '320px'
    this.videoElement.style.height = '240px'
    this.videoElement.autoplay = true
    this.videoElement.muted = true
    document.body.appendChild(this.videoElement)
  }

  async requestPermissions(): Promise<boolean> {
    try {
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      this.videoStream = stream
      this.audioStream = stream

      // Setup video element
      if (this.videoElement) {
        this.videoElement.srcObject = stream
        await this.videoElement.play()
      }

      // Setup audio analysis
      this.setupAudioAnalysis(stream)

      // Enter fullscreen
      await this.enterFullscreen()

      this.onPermissionsGranted?.()
      return true
    } catch (error) {
      console.error('Permission request failed:', error)
      return false
    }
  }

  private setupAudioAnalysis(stream: MediaStream) {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.microphone = this.audioContext.createMediaStreamSource(stream)
      this.analyser = this.audioContext.createAnalyser()
      
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.8
      
      this.microphone.connect(this.analyser)
      
      const bufferLength = this.analyser.frequencyBinCount
      this.dataArray = new Uint8Array(bufferLength)
    } catch (error) {
      console.error('Audio analysis setup failed:', error)
    }
  }

  async enterFullscreen(): Promise<boolean> {
    try {
      const element = document.documentElement
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen()
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen()
      }
      return true
    } catch (error) {
      console.error('Fullscreen request failed:', error)
      return false
    }
  }

  startMonitoring(callbacks: {
    onFaceNotDetected?: () => void
    onVoiceDetected?: () => void
    onFullscreenExit?: () => void
  }) {
    this.onFaceNotDetected = callbacks.onFaceNotDetected
    this.onVoiceDetected = callbacks.onVoiceDetected
    this.onFullscreenExit = callbacks.onFullscreenExit

    this.isMonitoring = true

    // Start face detection
    this.startFaceDetection()

    // Start voice detection
    this.startVoiceDetection()

    // Start fullscreen monitoring
    this.startFullscreenMonitoring()
  }

  private startFaceDetection() {
    if (!this.videoElement) return

    this.faceDetectionInterval = setInterval(() => {
      if (!this.isMonitoring) return

      // Simple face detection using canvas analysis
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx || !this.videoElement) return

      canvas.width = this.videoElement.videoWidth || 320
      canvas.height = this.videoElement.videoHeight || 240

      ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Simple face detection based on skin tone detection
      const hasFace = this.detectFaceInImageData(imageData)
      
      if (!hasFace) {
        this.onFaceNotDetected?.()
      }
    }, 2000) // Check every 2 seconds
  }

  private detectFaceInImageData(imageData: ImageData): boolean {
    const data = imageData.data
    let skinPixels = 0
    let totalPixels = 0

    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Simple skin tone detection
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b) {
        skinPixels++
      }
      totalPixels++
    }

    // Consider face detected if more than 5% of pixels are skin tone
    return (skinPixels / totalPixels) > 0.05
  }

  private startVoiceDetection() {
    if (!this.analyser || !this.dataArray) return

    this.voiceDetectionInterval = setInterval(() => {
      if (!this.isMonitoring) return

      this.analyser!.getByteFrequencyData(this.dataArray!)

      // Calculate average volume
      let sum = 0
      for (let i = 0; i < this.dataArray!.length; i++) {
        sum += this.dataArray![i]
      }
      const average = sum / this.dataArray!.length

      // Consider voice detected if average volume is above threshold
      if (average > 30) { // Adjust threshold as needed
        this.onVoiceDetected?.()
      }
    }, 1000) // Check every second
  }

  private startFullscreenMonitoring() {
    this.fullscreenCheckInterval = setInterval(() => {
      if (!this.isMonitoring) return

      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )

      if (!isFullscreen) {
        this.onFullscreenExit?.()
      }
    }, 500) // Check every 500ms
  }

  stopMonitoring() {
    this.isMonitoring = false

    // Clear intervals
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval)
      this.faceDetectionInterval = null
    }

    if (this.voiceDetectionInterval) {
      clearInterval(this.voiceDetectionInterval)
      this.voiceDetectionInterval = null
    }

    if (this.fullscreenCheckInterval) {
      clearInterval(this.fullscreenCheckInterval)
      this.fullscreenCheckInterval = null
    }

    // Stop streams
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop())
      this.videoStream = null
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop())
      this.audioStream = null
    }

    // Cleanup audio context
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    // Remove video element
    if (this.videoElement) {
      document.body.removeChild(this.videoElement)
      this.videoElement = null
    }
  }

  // Utility function to format CC amounts
  static formatCCAmount(amount: number): string {
    return `${amount.toLocaleString("en-IN")} CC`
  }
}

// Export singleton instance
export const contestMonitoring = new ContestMonitoringService()
