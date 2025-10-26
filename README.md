# Treso - Application de Suivi de Trésorerie Personnelle

Application de gestion financière personnelle avec connexion à Supabase et Plaid.

## Fonctionnalités

- 🔐 Authentification sécurisée avec Supabase
- 💳 Connexion aux comptes bancaires via Plaid
- 📊 Suivi des transactions en temps réel
- 💰 Vue d'ensemble de votre trésorerie

## Configuration

1. Copiez `.env.example` vers `.env` et remplissez les variables d'environnement :
   - Créez un projet sur [Supabase](https://supabase.com)
   - Créez un compte sur [Plaid](https://plaid.com) (utilisez le mode sandbox pour le développement)

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez la base de données Supabase (voir `supabase/schema.sql`)

4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

5. Ouvrez [http://localhost:3000](http://localhost:3000)

## Architecture

- **Frontend** : Next.js 14 avec App Router, TypeScript et Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Auth)
- **Intégration bancaire** : Plaid
