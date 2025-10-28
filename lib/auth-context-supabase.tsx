"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

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
          setUser(session.user)
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
          setUser(session.user)
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
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingUser) {
        // Use the service role key for this operation to bypass RLS
        const { error } = await supabaseAdmin.from('users').insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          username: user.user_metadata?.username || '@' + (user.user_metadata?.name || user.email!.split('@')[0]).toLowerCase(),
          wallet_balance: 1000, // Starting balance
        })

        if (error) {
          console.error('Error creating user profile:', error)
        } else {
          console.log('User profile created successfully')
        }
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
