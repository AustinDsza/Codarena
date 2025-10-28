"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MaterialCard } from '@/components/ui/material-card'
import { MaterialButton } from '@/components/ui/material-button'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage(error.message)
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('Email confirmed successfully! Redirecting...')
          
          // Redirect to home after 2 seconds
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          setStatus('expired')
          setMessage('Email confirmation link has expired. Please try registering again.')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage('An error occurred during email confirmation.')
      }
    }

    handleAuthCallback()
  }, [router])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />
      case 'expired':
        return <AlertCircle className="h-8 w-8 text-yellow-600" />
      default:
        return <AlertCircle className="h-8 w-8 text-gray-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'expired':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative max-w-md w-full">
        <MaterialCard elevation={2} className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {getStatusIcon()}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
              {status === 'loading' && 'Confirming Email...'}
              {status === 'success' && 'Email Confirmed!'}
              {status === 'error' && 'Confirmation Failed'}
              {status === 'expired' && 'Link Expired'}
            </h2>
            <p className="text-gray-600">{message}</p>
          </div>
          
          {status === 'expired' && (
            <div className="space-y-4">
              <Link href="/register">
                <MaterialButton
                  size="medium"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Register Again
                </MaterialButton>
              </Link>
              <Link href="/login">
                <MaterialButton
                  variant="outlined"
                  size="medium"
                  className="w-full"
                >
                  Try Login
                </MaterialButton>
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <Link href="/register">
                <MaterialButton
                  size="medium"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </MaterialButton>
              </Link>
              <Link href="/">
                <MaterialButton
                  variant="outlined"
                  size="medium"
                  className="w-full"
                >
                  Go Home
                </MaterialButton>
              </Link>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}
        </MaterialCard>
      </div>
    </div>
  )
}
