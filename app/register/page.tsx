"use client"

import { useState } from "react"
import { MaterialButton } from "@/components/ui/material-button"
import { MaterialInput } from "@/components/ui/material-input"
import { MaterialCard } from "@/components/ui/material-card"
import {
  Code2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  User,
  CheckCircle,
  AlertCircle,
  UserPlus,
  AtSign,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context-supabase"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { signUp, signIn } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return false
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long")
      return false
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError("Username can only contain letters, numbers, and underscores")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!validateForm()) {
        setIsLoading(false)
        return
      }

      // Register with Supabase
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.username
      )

      if (signUpError) {
        console.error('Registration error:', signUpError)
        
        // Handle specific error cases
        if (signUpError.message.includes('User already registered')) {
          setError("An account with this email already exists. Please try logging in instead.")
        } else if (signUpError.message.includes('Password should be at least')) {
          setError("Password must be at least 6 characters long.")
        } else {
          setError(signUpError.message || "Registration failed. Please try again.")
        }
        return
      }

      // Show success message about email confirmation
      setSuccess(true)
      setError("") // Clear any previous errors
      
      // Redirect after success message
      setTimeout(() => {
        router.push("/")
      }, 1500)

    } catch (err) {
      console.error('Registration error:', err)
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-2">Welcome to Codarena! Please check your email and click the confirmation link to activate your account.</p>
              <p className="text-sm text-blue-600">You can then log in with your credentials.</p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </MaterialCard>
        </div>
      </div>
    )
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

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-600">Codarena</h1>
              <p className="text-xs text-gray-500 -mt-1">Daily Coding Battles</p>
            </div>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Codarena</h2>
          <p className="text-gray-600">Create your account and start coding battles</p>
        </div>

        {/* Registration Form */}
        <MaterialCard elevation={2} className="p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Name Field */}
            <div>
              <MaterialInput
                type="text"
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                startIcon={<User className="h-4 w-4" />}
                required
                className="w-full"
              />
            </div>

            {/* Username Field */}
            <div>
              <MaterialInput
                type="text"
                label="Username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Choose a unique username"
                startIcon={<AtSign className="h-4 w-4" />}
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only letters, numbers, and underscores allowed. Min 3 characters.
              </p>
            </div>

            {/* Email Field */}
            <div>
              <MaterialInput
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                startIcon={<Mail className="h-4 w-4" />}
                required
                className="w-full"
              />
            </div>

            {/* Password Field */}
            <div>
              <MaterialInput
                type={showPassword ? "text" : "password"}
                label="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a password"
                startIcon={<Lock className="h-4 w-4" />}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
                className="w-full"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <MaterialInput
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                startIcon={<Lock className="h-4 w-4" />}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                required
                className="w-full"
              />
            </div>

            {/* Register Button */}
            <MaterialButton
              type="submit"
              fullWidth
              size="medium"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              startIcon={
                isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )
              }
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </MaterialButton>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in to your account
            </Link>
          </div>
        </MaterialCard>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
