import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">💰 Treso</h1>
            <p className="text-gray-600">
              Gérez votre trésorerie personnelle en toute simplicité
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-200"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/signup"
              className="block w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-4 rounded-lg text-center border-2 border-blue-600 transition duration-200"
            >
              Créer un compte
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Fonctionnalités
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">🔐</span>
                Authentification sécurisée
              </li>
              <li className="flex items-center">
                <span className="mr-2">💳</span>
                Connexion aux comptes bancaires
              </li>
              <li className="flex items-center">
                <span className="mr-2">📊</span>
                Suivi des transactions en temps réel
              </li>
              <li className="flex items-center">
                <span className="mr-2">💰</span>
                Vue d'ensemble de votre trésorerie
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
