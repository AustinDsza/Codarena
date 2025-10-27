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
  private faceDisplayElement: HTMLVideoElement | null = null
  private soundAlert: HTMLAudioElement | null = null
  private fullscreenChangeHandler: (() => void) | null = null

  // Callbacks for violations
  private onFaceNotDetected?: () => void
  private onVoiceDetected?: () => void
  private onFullscreenExit?: () => void
  private onPermissionsGranted?: () => void

  constructor() {
    // Only setup video element on client side
    if (typeof window !== 'undefined') {
      this.setupVideoElement()
      this.setupFaceDisplay()
      this.setupSoundAlert()
    }
  }

  private setupVideoElement() {
    // Only create video element on client side
    if (typeof window === 'undefined') return
    
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

  private setupFaceDisplay() {
    // Only create face display on client side
    if (typeof window === 'undefined') return
    
    // Create a visible video element for face display in corner
    this.faceDisplayElement = document.createElement('video')
    this.faceDisplayElement.style.position = 'fixed'
    this.faceDisplayElement.style.top = '20px'
    this.faceDisplayElement.style.right = '20px'
    this.faceDisplayElement.style.width = '120px'
    this.faceDisplayElement.style.height = '90px'
    this.faceDisplayElement.style.border = '2px solid #3b82f6'
    this.faceDisplayElement.style.borderRadius = '8px'
    this.faceDisplayElement.style.backgroundColor = '#000'
    this.faceDisplayElement.style.zIndex = '9999'
    this.faceDisplayElement.style.display = 'none' // Hidden initially
    this.faceDisplayElement.autoplay = true
    this.faceDisplayElement.muted = true
    document.body.appendChild(this.faceDisplayElement)
  }

  private setupSoundAlert() {
    // Only create sound alert on client side
    if (typeof window === 'undefined') return
    
    // Create audio element for fullscreen exit alert
    this.soundAlert = document.createElement('audio')
    this.soundAlert.preload = 'auto'
    
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
      
      // Store the audio context for reuse
      this.audioContext = audioContext
    } catch (error) {
      console.warn('Could not create sound alert:', error)
    }
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

      // Setup face display - ensure it's created if not exists
      if (!this.faceDisplayElement) {
        this.setupFaceDisplay()
      }
      
      if (this.faceDisplayElement) {
        this.faceDisplayElement.srcObject = stream
        await this.faceDisplayElement.play()
        this.faceDisplayElement.style.display = 'block'
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
    // Add immediate event listeners for fullscreen changes
    this.fullscreenChangeHandler = () => {
      if (!this.isMonitoring) return

      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )

      if (!isFullscreen) {
        // Play sound immediately when fullscreen is exited
        this.playSoundAlert()
        this.onFullscreenExit?.()
      }
    }

    // Listen for fullscreen change events (immediate response)
    document.addEventListener('fullscreenchange', this.fullscreenChangeHandler)
    document.addEventListener('webkitfullscreenchange', this.fullscreenChangeHandler)
    document.addEventListener('mozfullscreenchange', this.fullscreenChangeHandler)
    document.addEventListener('MSFullscreenChange', this.fullscreenChangeHandler)

    // Also keep the interval check as backup (less frequent)
    this.fullscreenCheckInterval = setInterval(() => {
      if (!this.isMonitoring) return

      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )

      if (!isFullscreen) {
        this.playSoundAlert()
        this.onFullscreenExit?.()
      }
    }, 2000) // Check every 2 seconds as backup
  }

  private playSoundAlert() {
    if (typeof window === 'undefined') return
    
    try {
      // Create a new audio context for each alert to ensure it works
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create a more noticeable and immediate alert sound
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Create a distinctive, loud beep pattern that starts immediately
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime) // Higher frequency for urgency
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.05)
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.15)
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.25)
      
      // Higher volume for immediate attention
      gainNode.gain.setValueAtTime(0.8, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
      
      // Close the audio context after playing
      setTimeout(() => {
        audioContext.close()
      }, 400)
    } catch (error) {
      console.warn('Could not play sound alert:', error)
    }
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

    // Remove fullscreen event listeners
    if (this.fullscreenChangeHandler) {
      document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler)
      document.removeEventListener('webkitfullscreenchange', this.fullscreenChangeHandler)
      document.removeEventListener('mozfullscreenchange', this.fullscreenChangeHandler)
      document.removeEventListener('MSFullscreenChange', this.fullscreenChangeHandler)
      this.fullscreenChangeHandler = null
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

    // Hide and remove face display element
    if (this.faceDisplayElement) {
      this.faceDisplayElement.style.display = 'none'
      document.body.removeChild(this.faceDisplayElement)
      this.faceDisplayElement = null
    }
  }

  // Utility function to format CC amounts
  static formatCCAmount(amount: number): string {
    return `${amount.toLocaleString("en-IN")} CC`
  }
}

// Export singleton instance - only create on client side
export const contestMonitoring = typeof window !== 'undefined' ? new ContestMonitoringService() : {
  requestPermissions: () => Promise.resolve(false),
  startMonitoring: () => {},
  stopMonitoring: () => {},
  enterFullscreen: () => Promise.resolve(false),
} as any
