import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bank_accounts: {
        Row: {
          id: string
          user_id: string
          plaid_account_id: string
          plaid_item_id: string
          access_token: string
          account_name: string
          account_type: string | null
          account_subtype: string | null
          institution_name: string | null
          mask: string | null
          current_balance: number | null
          available_balance: number | null
          currency_code: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plaid_account_id: string
          plaid_item_id: string
          access_token: string
          account_name: string
          account_type?: string | null
          account_subtype?: string | null
          institution_name?: string | null
          mask?: string | null
          current_balance?: number | null
          available_balance?: number | null
          currency_code?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plaid_account_id?: string
          plaid_item_id?: string
          access_token?: string
          account_name?: string
          account_type?: string | null
          account_subtype?: string | null
          institution_name?: string | null
          mask?: string | null
          current_balance?: number | null
          available_balance?: number | null
          currency_code?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          plaid_transaction_id: string | null
          amount: number
          date: string
          name: string
          merchant_name: string | null
          category: string[] | null
          pending: boolean
          payment_channel: string | null
          transaction_type: string | null
          iso_currency_code: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          plaid_transaction_id?: string | null
          amount: number
          date: string
          name: string
          merchant_name?: string | null
          category?: string[] | null
          pending?: boolean
          payment_channel?: string | null
          transaction_type?: string | null
          iso_currency_code?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          plaid_transaction_id?: string | null
          amount?: number
          date?: string
          name?: string
          merchant_name?: string | null
          category?: string[] | null
          pending?: boolean
          payment_channel?: string | null
          transaction_type?: string | null
          iso_currency_code?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
