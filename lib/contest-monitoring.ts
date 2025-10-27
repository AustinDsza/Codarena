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
  private monitoringStartTime: number = 0

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
    this.faceDisplayElement.style.top = '80px' // Position below monitoring status
    this.faceDisplayElement.style.right = '20px'
    this.faceDisplayElement.style.width = '120px'
    this.faceDisplayElement.style.height = '90px'
    this.faceDisplayElement.style.border = '2px solid #3b82f6'
    this.faceDisplayElement.style.borderRadius = '8px'
    this.faceDisplayElement.style.backgroundColor = '#000'
    this.faceDisplayElement.style.zIndex = '9999' // Above all other elements
    this.faceDisplayElement.style.display = 'none' // Hidden initially
    this.faceDisplayElement.autoplay = true
    this.faceDisplayElement.muted = true
    this.faceDisplayElement.playsInline = true // Important for mobile compatibility
    this.faceDisplayElement.controls = false
    
    // Add event listeners for debugging
    this.faceDisplayElement.addEventListener('loadedmetadata', () => {
      console.log('Face display metadata loaded')
    })
    
    this.faceDisplayElement.addEventListener('canplay', () => {
      console.log('Face display can play')
    })
    
    this.faceDisplayElement.addEventListener('error', (e) => {
      console.error('Face display video error:', e)
    })
    
    document.body.appendChild(this.faceDisplayElement)
    console.log('Face display element created and added to DOM')
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
      console.log('Requesting camera and microphone permissions...')
      
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

      console.log('Permissions granted, stream received:', stream)
      console.log('Video tracks:', stream.getVideoTracks())
      console.log('Audio tracks:', stream.getAudioTracks())

      this.videoStream = stream
      this.audioStream = stream

      // Setup video element
      if (this.videoElement) {
        this.videoElement.srcObject = stream
        await this.videoElement.play()
        console.log('Hidden video element setup complete')
      }

      // Setup face display - ensure it's created if not exists
      if (!this.faceDisplayElement) {
        this.setupFaceDisplay()
      }
      
      if (this.faceDisplayElement) {
        console.log('Setting up face display with stream:', stream)
        this.faceDisplayElement.srcObject = stream
        this.faceDisplayElement.style.display = 'block'
        
        // Ensure the video plays
        try {
          await this.faceDisplayElement.play()
          console.log('Face display video started playing')
        } catch (playError) {
          console.error('Failed to play face display video:', playError)
          // Try to play again after a short delay
          setTimeout(async () => {
            try {
              await this.faceDisplayElement!.play()
              console.log('Face display video started playing (retry)')
            } catch (retryError) {
              console.error('Failed to play face display video (retry):', retryError)
            }
          }, 100)
        }
      } else {
        console.error('Face display element not created')
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
    this.monitoringStartTime = Date.now() // Record when monitoring started

    // Ensure facecam is visible and working during monitoring
    if (this.faceDisplayElement && this.videoStream) {
      console.log('Ensuring facecam is visible during monitoring')
      this.faceDisplayElement.style.display = 'block'
      
      // Reconnect the stream if needed
      if (!this.faceDisplayElement.srcObject) {
        this.faceDisplayElement.srcObject = this.videoStream
        this.faceDisplayElement.play().catch(e => {
          console.error('Failed to play facecam during monitoring:', e)
        })
      }
    } else {
      // Force create facecam if it doesn't exist
      console.log('Facecam element missing, creating it...')
      this.setupFaceDisplay()
      if (this.faceDisplayElement && this.videoStream) {
        this.faceDisplayElement.srcObject = this.videoStream
        this.faceDisplayElement.style.display = 'block'
        this.faceDisplayElement.play().catch(e => {
          console.error('Failed to play facecam after creation:', e)
        })
      }
    }

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

      // Don't show face detection warnings for the first 30 seconds
      const timeSinceStart = Date.now() - this.monitoringStartTime
      if (timeSinceStart < 30000) { // 30 seconds grace period
        return
      }

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

      // Don't show voice detection warnings for the first 30 seconds
      const timeSinceStart = Date.now() - this.monitoringStartTime
      if (timeSinceStart < 30000) { // 30 seconds grace period
        return
      }

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
      // Higher frequency and more aggressive pattern for MCQ contests
      oscillator.frequency.setValueAtTime(1500, audioContext.currentTime) // Even higher frequency
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.05)
      oscillator.frequency.setValueAtTime(1500, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.15)
      oscillator.frequency.setValueAtTime(1500, audioContext.currentTime + 0.2)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.25)
      oscillator.frequency.setValueAtTime(1500, audioContext.currentTime + 0.3)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.35)
      
      // Higher volume for immediate attention - increased for MCQ contests
      gainNode.gain.setValueAtTime(0.9, audioContext.currentTime) // Increased from 0.8 to 0.9
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
      
      // Close the audio context after playing
      setTimeout(() => {
        audioContext.close()
      }, 500)
      
      console.log('Fullscreen violation sound alert played for MCQ contest')
    } catch (error) {
      console.warn('Could not play sound alert:', error)
    }
  }

  stopMonitoring() {
    console.log('Stopping monitoring and cleaning up all resources...')
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

    // Force stop all media streams aggressively
    this.forceStopAllStreams()

    // Cleanup audio context
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    // Remove video element
    if (this.videoElement) {
      try {
        document.body.removeChild(this.videoElement)
      } catch (e) {
        console.warn('Could not remove video element:', e)
      }
      this.videoElement = null
    }

    // Hide and remove face display element
    if (this.faceDisplayElement) {
      try {
        this.faceDisplayElement.style.display = 'none'
        document.body.removeChild(this.faceDisplayElement)
      } catch (e) {
        console.warn('Could not remove face display element:', e)
      }
      this.faceDisplayElement = null
    }

    console.log('Monitoring stopped and all resources cleaned up')
  }

  // Force stop all media streams aggressively
  private forceStopAllStreams() {
    console.log('Force stopping all media streams...')
    
    // Stop video stream
    if (this.videoStream) {
      console.log('Stopping video stream tracks:', this.videoStream.getTracks().length)
      this.videoStream.getTracks().forEach(track => {
        console.log('Stopping video track:', track.kind, track.label)
        track.stop()
      })
      this.videoStream = null
    }

    // Stop audio stream
    if (this.audioStream) {
      console.log('Stopping audio stream tracks:', this.audioStream.getTracks().length)
      this.audioStream.getTracks().forEach(track => {
        console.log('Stopping audio track:', track.kind, track.label)
        track.stop()
      })
      this.audioStream = null
    }

    // Force stop any remaining media devices
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // This is a more aggressive approach to ensure all streams are stopped
      navigator.mediaDevices.getUserMedia({ video: false, audio: false })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop())
        })
        .catch(() => {
          // Ignore errors, this is just to ensure cleanup
        })
    }
  }

  // Public method to force stop camera (can be called from components)
  forceStopCamera() {
    console.log('Force stopping camera from external call...')
    this.forceStopAllStreams()
    
    // Also hide face display immediately
    if (this.faceDisplayElement) {
      this.faceDisplayElement.style.display = 'none'
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
