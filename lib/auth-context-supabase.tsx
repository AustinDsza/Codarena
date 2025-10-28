"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, supabaseAdmin } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: { name?: string }) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null) // Changed to any to include profile data
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user)
        if (profile) {
          setUser(profile)
        } else {
          // Fallback to auth user data if profile fetch fails
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            username: session.user.user_metadata?.username || '@' + (session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'user').toLowerCase(),
            wallet_balance: 1000
          })
        }
      } else {
        setUser(null)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setLoading(false)

      if (session?.user) {
        // Create user profile if new user
        if (event === 'SIGNED_IN') {
          await createUserProfile(session.user)
        }
        
        // Fetch user profile from database
        const profile = await fetchUserProfile(session.user)
        if (profile) {
          setUser(profile)
        } else {
          // Fallback to auth user data if profile fetch fails
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            username: session.user.user_metadata?.username || '@' + (session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'user').toLowerCase(),
            wallet_balance: 1000
          })
        }
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        // If table doesn't exist or user not found, return auth user data
        if (error.code === 'PGRST116' || error.code === 'PGRST301') {
          console.log('User profile not found, using auth data')
          return {
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            username: authUser.user_metadata?.username || '@' + (authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'user').toLowerCase(),
            wallet_balance: 1000
          }
        }

        // If username field doesn't exist, return user data without username
        if (error.message.includes('username')) {
          console.log('Username field not found in database, using auth data')
          return {
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            username: authUser.user_metadata?.username || '@' + (authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'user').toLowerCase(),
            wallet_balance: 1000
          }
        }
        console.error('Error fetching user profile:', error)
        return null
      }

      return profile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const createUserProfile = async (user: User) => {
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError)
        return
      }

      if (!existingUser) {
        // Use the service role key for this operation to bypass RLS
        const baseUserData = {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          wallet_balance: 1000, // Starting balance
        }

        // Try to insert with username first (if field exists)
        const username = user.user_metadata?.username || '@' + (user.user_metadata?.name || user.email!.split('@')[0]).toLowerCase()
        const userDataWithUsername = { ...baseUserData, username }

        let { error } = await supabaseAdmin.from('users').insert(userDataWithUsername)

        // If username field doesn't exist, try without it
        if (error && error.message.includes('username')) {
          console.log('Username field not found, inserting without username')
          const { error: fallbackError } = await supabaseAdmin.from('users').insert(baseUserData)
          error = fallbackError
        }

        if (error) {
          console.error('Error creating user profile:', error)
        } else {
          console.log('User profile created successfully')
        }
      } else {
        console.log('User profile already exists')
      }
    } catch (error) {
      console.error('Error checking/creating user profile:', error)
    }
  }

  const signUp = async (email: string, password: string, name: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: { name?: string }) => {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user?.id)
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
