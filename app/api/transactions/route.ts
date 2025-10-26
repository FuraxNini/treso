import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        bank_accounts (
          account_name,
          institution_name,
          mask
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ transactions: data })
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
