import { NextResponse } from 'next/server'
import { plaidClient } from '@/lib/plaid'
import { supabase } from '@/lib/supabase'
import { CountryCode } from 'plaid'

export async function POST(request: Request) {
  try {
    const { publicToken, userId } = await request.json()

    if (!publicToken || !userId) {
      return NextResponse.json(
        { error: 'Public token and user ID are required' },
        { status: 400 }
      )
    }

    // Échanger le public token contre un access token
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })

    const accessToken = tokenResponse.data.access_token
    const itemId = tokenResponse.data.item_id

    // Récupérer les comptes
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    })

    const accounts = accountsResponse.data.accounts
    const institution = accountsResponse.data.item.institution_id

    // Récupérer les informations de l'institution
    let institutionName = 'Unknown'
    try {
      const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: institution || '',
        country_codes: [CountryCode.Fr, CountryCode.Us],
      })
      institutionName = institutionResponse.data.institution.name
    } catch (err) {
      console.error('Error fetching institution:', err)
    }

    // Sauvegarder les comptes dans Supabase
    const accountsToInsert = accounts.map((account) => ({
      user_id: userId,
      plaid_account_id: account.account_id,
      plaid_item_id: itemId,
      access_token: accessToken,
      account_name: account.name,
      account_type: account.type,
      account_subtype: account.subtype,
      institution_name: institutionName,
      mask: account.mask,
      current_balance: account.balances.current,
      available_balance: account.balances.available,
      currency_code: account.balances.iso_currency_code || 'EUR',
    }))

    const { data, error } = await supabase
      .from('bank_accounts')
      .insert(accountsToInsert)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Synchroniser les transactions initiales
    await syncTransactions(accessToken, userId, data)

    return NextResponse.json({
      success: true,
      accounts: data,
    })
  } catch (error: any) {
    console.error('Error exchanging token:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to exchange token' },
      { status: 500 }
    )
  }
}

async function syncTransactions(
  accessToken: string,
  userId: string,
  accounts: any[]
) {
  try {
    // Récupérer les transactions des 30 derniers jours
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    const endDate = new Date()

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    })

    const transactions = transactionsResponse.data.transactions

    // Trouver le compte correspondant dans notre base de données
    const transactionsToInsert = transactions.map((transaction) => {
      const account = accounts.find(
        (acc) => acc.plaid_account_id === transaction.account_id
      )

      return {
        user_id: userId,
        account_id: account?.id,
        plaid_transaction_id: transaction.transaction_id,
        amount: transaction.amount,
        date: transaction.date,
        name: transaction.name,
        merchant_name: transaction.merchant_name,
        category: transaction.category,
        pending: transaction.pending,
        payment_channel: transaction.payment_channel,
        transaction_type: transaction.transaction_type,
        iso_currency_code: transaction.iso_currency_code || 'EUR',
      }
    })

    const { error } = await supabase
      .from('transactions')
      .insert(transactionsToInsert)

    if (error) {
      console.error('Error inserting transactions:', error)
    }
  } catch (error) {
    console.error('Error syncing transactions:', error)
  }
}
