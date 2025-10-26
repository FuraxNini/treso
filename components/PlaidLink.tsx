'use client'

import { useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'

interface PlaidLinkProps {
  userId: string
  onSuccess: () => void
}

export default function PlaidLink({ userId, onSuccess }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch('/api/plaid/create-link-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        })

        const data = await response.json()
        setLinkToken(data.link_token)
      } catch (error) {
        console.error('Error creating link token:', error)
      }
    }

    createLinkToken()
  }, [userId])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken) => {
      setLoading(true)
      try {
        const response = await fetch('/api/plaid/exchange-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicToken, userId }),
        })

        if (response.ok) {
          onSuccess()
        }
      } catch (error) {
        console.error('Error exchanging token:', error)
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <button
      onClick={() => open()}
      disabled={!ready || loading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Connexion en cours...' : '🏦 Connecter un compte bancaire'}
    </button>
  )
}
