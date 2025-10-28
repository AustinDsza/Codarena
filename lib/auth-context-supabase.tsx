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
        // Use auth user data immediately for faster initial load
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          username: session.user.user_metadata?.username || '@' + (session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'user').toLowerCase(),
          wallet_balance: 1000
        }
        
        setUser(userData)
        
        // Fetch updated profile from database in background (async)
        fetchUserProfile(session.user).then(profile => {
          if (profile) {
            setUser(profile)
          }
        }).catch(console.error)
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
        // Create user profile if new user (async, don't wait)
        if (event === 'SIGNED_IN') {
          createUserProfile(session.user).catch(console.error)
        }
        
        // Use auth user data immediately for faster login
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          username: session.user.user_metadata?.username || '@' + (session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'user').toLowerCase(),
          wallet_balance: 1000
        }
        
        setUser(userData)
        
        // Fetch updated profile from database in background (async)
        fetchUserProfile(session.user).then(profile => {
          if (profile) {
            setUser(profile)
          }
        }).catch(console.error)
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
      console.log('Creating user profile for:', {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        username: user.user_metadata?.username
      })

      // Validate user ID is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(user.id)) {
        console.error('Invalid user ID format:', user.id)
        return
      }

      // Add a small delay to prevent race conditions
      await new Promise(resolve => setTimeout(resolve, 100))

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

        console.log('Attempting to insert user data:', userDataWithUsername)

        // Try using RPC function to bypass RLS
        const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('create_user_profile', {
          user_id: user.id,
          user_email: user.email!,
          user_name: user.user_metadata?.name || user.email!.split('@')[0],
          user_username: username,
          user_wallet_balance: 1000
        })

        let error = rpcError

        // If RPC doesn't exist, fall back to direct insert
        if (error && error.message.includes('function') && error.message.includes('does not exist')) {
          console.log('RPC function not found, trying direct insert')
          let { error: insertError } = await supabaseAdmin.from('users').insert(userDataWithUsername)

          // If username field doesn't exist, try without it
          if (insertError && insertError.message.includes('username')) {
            console.log('Username field not found, inserting without username')
            const { error: fallbackError } = await supabaseAdmin.from('users').insert(baseUserData)
            if (fallbackError) {
              console.error('Fallback insert also failed:', fallbackError)
              console.error('Fallback error details:', JSON.stringify(fallbackError, null, 2))
            } else {
              console.log('User profile created successfully (without username)')
            }
            insertError = fallbackError
          }
          error = insertError
        }

        if (error) {
          console.error('Error creating user profile:', error)
          console.error('Error details:', JSON.stringify(error, null, 2))
          console.error('User data that failed to insert:', userDataWithUsername)
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
