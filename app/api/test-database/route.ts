import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing database schema...')
    
    // Test 1: Try to select from users table to see what columns exist
    const { data: users, error: selectError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1)

    if (selectError) {
      console.error('Error selecting from users table:', selectError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to select from users table',
        details: selectError 
      })
    }

    console.log('Users table structure (sample):', users)

    // Test 2: Try to insert a test user with username
    const testUserId = '550e8400-e29b-41d4-a716-446655440001' // Valid UUID
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        id: testUserId,
        email: 'test@example.com',
        name: 'Test User',
        username: '@testuser',
        wallet_balance: 1000
      })
      .select()

    if (insertError) {
      console.error('Error inserting test user:', insertError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to insert test user - username field may not exist',
        details: insertError,
        existingUsers: users
      })
    }

    // Clean up test user
    await supabaseAdmin.from('users').delete().eq('id', testUserId)

    return NextResponse.json({ 
      success: true, 
      message: 'Database schema is correct - username field exists',
      existingUsers: users,
      testInsert: insertData
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Database test failed',
      details: error 
    })
  }
}
