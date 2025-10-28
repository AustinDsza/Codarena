import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          wallet_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          wallet_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          wallet_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      contests: {
        Row: {
          id: string
          title: string
          description: string
          type: 'dsa' | 'logic' | 'mcq'
          category: string
          creator_id: string
          entry_fee: number
          prize_pool: number
          max_participants: number
          current_participants: number
          start_time: string
          end_time: string
          is_live: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'dsa' | 'logic' | 'mcq'
          category: string
          creator_id: string
          entry_fee: number
          prize_pool: number
          max_participants: number
          current_participants?: number
          start_time: string
          end_time: string
          is_live?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'dsa' | 'logic' | 'mcq'
          category?: string
          creator_id?: string
          entry_fee?: number
          prize_pool?: number
          max_participants?: number
          current_participants?: number
          start_time?: string
          end_time?: string
          is_live?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      problems: {
        Row: {
          id: string
          contest_id: string
          title: string
          description: string
          difficulty: 'Easy' | 'Medium' | 'Hard'
          points: number
          constraints: string[]
          hints: string[]
          test_cases: any[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contest_id: string
          title: string
          description: string
          difficulty: 'Easy' | 'Medium' | 'Hard'
          points: number
          constraints: string[]
          hints: string[]
          test_cases: any[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contest_id?: string
          title?: string
          description?: string
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          points?: number
          constraints?: string[]
          hints?: string[]
          test_cases?: any[]
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          contest_id: string
          problem_id: string
          code: string
          language: string
          status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error'
          score: number
          execution_time: number
          memory_used: number
          test_cases_passed: number
          total_test_cases: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contest_id: string
          problem_id: string
          code: string
          language: string
          status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error'
          score: number
          execution_time: number
          memory_used: number
          test_cases_passed: number
          total_test_cases: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contest_id?: string
          problem_id?: string
          code?: string
          language?: string
          status?: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error'
          score?: number
          execution_time?: number
          memory_used?: number
          test_cases_passed?: number
          total_test_cases?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'credit' | 'debit'
          description: string
          contest_name?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'credit' | 'debit'
          description: string
          contest_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'credit' | 'debit'
          description?: string
          contest_name?: string
          created_at?: string
        }
      }
    }
  }
}
