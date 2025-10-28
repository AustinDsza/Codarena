import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Check if we can connect to Supabase
    const { data: authData, error: authError } = await supabase.auth.getSession()
    console.log('Auth session:', authData, authError)
    
    // Test 2: Check if users table exists
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    console.log('Users table test:', usersData, usersError)
    
    // Test 3: Check if we can insert a test user (this will fail if RLS is blocking)
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        email: 'test@example.com',
        name: 'Test User',
        wallet_balance: 1000
      })
      .select()
    
    console.log('Insert test:', insertData, insertError)
    
    return NextResponse.json({
      success: true,
      auth: { data: authData, error: authError },
      usersTable: { data: usersData, error: usersError },
      insertTest: { data: insertData, error: insertError },
      message: 'Supabase connection test completed'
    })
  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Supabase connection test failed'
    }, { status: 500 })
  }
}
