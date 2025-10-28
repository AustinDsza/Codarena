import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: contest, error } = await supabase
      .from('contests')
      .select(`
        *,
        creator:users!contests_creator_id_fkey(name),
        problems(*)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching contest:', error)
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 })
    }

    return NextResponse.json({ contest })
  } catch (error) {
    console.error('Contest API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    const { data: contest, error } = await supabase
      .from('contests')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contest:', error)
      return NextResponse.json({ error: 'Failed to update contest' }, { status: 500 })
    }

    return NextResponse.json({ contest })
  } catch (error) {
    console.error('Update contest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('contests')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting contest:', error)
      return NextResponse.json({ error: 'Failed to delete contest' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Contest deleted successfully' })
  } catch (error) {
    console.error('Delete contest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
