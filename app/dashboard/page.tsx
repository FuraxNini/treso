'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PlaidLink from '@/components/PlaidLink'

interface BankAccount {
  id: string
  account_name: string
  institution_name: string
  mask: string
  current_balance: number
  available_balance: number
  currency_code: string
}

interface Transaction {
  id: string
  amount: number
  date: string
  name: string
  merchant_name: string
  category: string[]
  pending: boolean
  bank_accounts: {
    account_name: string
    institution_name: string
    mask: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      await fetchAccounts(user.id)
      await fetchTransactions(user.id)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const fetchAccounts = async (userId: string) => {
    try {
      const response = await fetch(`/api/accounts?userId=${userId}`)
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  const fetchTransactions = async (userId: string) => {
    try {
      const response = await fetch(`/api/transactions?userId=${userId}`)
      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleRefresh = async () => {
    if (user) {
      await fetchAccounts(user.id)
      await fetchTransactions(user.id)
    }
  }

  const totalBalance = accounts.reduce(
    (sum, account) => sum + (account.current_balance || 0),
    0
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">💰 Treso</h1>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance totale */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-lg font-medium mb-2">Balance totale</h2>
          <p className="text-4xl font-bold">
            {totalBalance.toLocaleString('fr-FR', {
              style: 'currency',
              currency: accounts[0]?.currency_code || 'EUR',
            })}
          </p>
          <p className="text-sm mt-2 opacity-90">
            {accounts.length} compte{accounts.length > 1 ? 's' : ''} connecté{accounts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Comptes bancaires */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Comptes bancaires
            </h2>
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                🔄 Actualiser
              </button>
              {user && (
                <PlaidLink userId={user.id} onSuccess={handleRefresh} />
              )}
            </div>
          </div>

          {accounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">Aucun compte connecté</p>
              <p className="text-sm">
                Connectez votre premier compte bancaire pour commencer
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {account.account_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {account.institution_name} ••••{account.mask}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {account.current_balance?.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: account.currency_code,
                      })}
                    </p>
                    {account.available_balance !== null && (
                      <p className="text-sm text-gray-500 mt-1">
                        Disponible:{' '}
                        {account.available_balance?.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: account.currency_code,
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transactions récentes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Transactions récentes
          </h2>

          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">Aucune transaction</p>
              <p className="text-sm">
                Vos transactions apparaîtront ici une fois synchronisées
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        {transaction.merchant_name || transaction.name}
                      </h3>
                      {transaction.pending && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          En attente
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500">
                        {transaction.bank_accounts?.institution_name} ••••
                        {transaction.bank_accounts?.mask}
                      </p>
                      {transaction.category && transaction.category.length > 0 && (
                        <span className="text-xs text-gray-400">
                          • {transaction.category[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.amount < 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.amount < 0 ? '+' : '-'}
                      {Math.abs(transaction.amount).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
