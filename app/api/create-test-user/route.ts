import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // Generate a proper UUID for testing
    const testUserId = '550e8400-e29b-41d4-a716-446655440000'
    const testUser = {
      id: testUserId,
      email: 'test@example.com',
      name: 'Test User',
      username: '@testuser',
      wallet_balance: 1000
    }

    console.log('Creating test user with data:', testUser)

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(testUser)
      .select()

    if (error) {
      console.error('Error creating test user:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create test user',
        details: error,
        userData: testUser
      })
    }

    // Clean up test user
    await supabaseAdmin.from('users').delete().eq('id', testUserId)

    return NextResponse.json({ 
      success: true, 
      message: 'Test user created and deleted successfully',
      testUser: data
    })

  } catch (error) {
    console.error('Test user creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Test user creation failed',
      details: error 
    })
  }
}
