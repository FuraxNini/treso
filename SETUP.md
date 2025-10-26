# Guide de Configuration - Treso

Ce guide vous accompagne dans la configuration complète de votre application de suivi de trésorerie personnelle.

## 1. Configuration de Supabase

### Créer un projet Supabase

1. Rendez-vous sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - Nom du projet : `treso`
   - Mot de passe de la base de données (notez-le bien !)
   - Région : choisissez la plus proche de vous

### Configurer la base de données

1. Une fois le projet créé, allez dans l'onglet "SQL Editor"
2. Copiez le contenu du fichier `supabase/schema.sql`
3. Collez-le dans l'éditeur SQL et exécutez-le
4. Vérifiez que toutes les tables ont été créées dans l'onglet "Table Editor"

### Récupérer les clés API

1. Allez dans "Settings" > "API"
2. Copiez :
   - `Project URL` → sera votre `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public key` → sera votre `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Configurer l'authentification

1. Allez dans "Authentication" > "Providers"
2. Activez "Email" (activé par défaut)
3. Vous pouvez configurer d'autres providers si souhaité (Google, GitHub, etc.)

## 2. Configuration de Plaid

### Créer un compte Plaid

1. Rendez-vous sur [https://dashboard.plaid.com/signup](https://dashboard.plaid.com/signup)
2. Créez un compte développeur (gratuit)
3. Confirmez votre email

### Mode Sandbox (Développement)

1. Connectez-vous au [Dashboard Plaid](https://dashboard.plaid.com)
2. Allez dans "Team Settings" > "Keys"
3. Copiez :
   - `client_id` → sera votre `PLAID_CLIENT_ID`
   - `sandbox secret` → sera votre `PLAID_SECRET`

### Comptes de test Plaid

En mode sandbox, utilisez ces identifiants pour tester :
- **Username** : `user_good`
- **Password** : `pass_good`

Plaid vous montrera des comptes et transactions fictifs.

### Mode Production (Plus tard)

Pour connecter de vrais comptes bancaires :
1. Complétez le processus de vérification Plaid
2. Passez au plan payant
3. Utilisez les clés de production au lieu des clés sandbox
4. Changez `PLAID_ENV=production` dans votre `.env`

## 3. Configuration de l'application

### Créer le fichier .env

```bash
cp .env.example .env
```

### Remplir les variables d'environnement

Éditez le fichier `.env` :

```env
# Supabase (récupéré à l'étape 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Plaid (récupéré à l'étape 2)
PLAID_CLIENT_ID=votre_client_id
PLAID_SECRET=votre_secret_sandbox
PLAID_ENV=sandbox
NEXT_PUBLIC_PLAID_ENV=sandbox
```

### Installer les dépendances

```bash
npm install
```

### Lancer l'application

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 4. Premiers pas

### Créer un compte

1. Ouvrez [http://localhost:3000](http://localhost:3000)
2. Cliquez sur "Créer un compte"
3. Remplissez vos informations
4. Vous serez automatiquement redirigé vers le tableau de bord

### Connecter un compte bancaire (Mode Test)

1. Sur le tableau de bord, cliquez sur "Connecter un compte bancaire"
2. La fenêtre Plaid s'ouvrira
3. Recherchez "Platypus Bank" (banque de test)
4. Utilisez les identifiants de test :
   - Username: `user_good`
   - Password: `pass_good`
5. Sélectionnez le compte à connecter
6. Vos transactions de test apparaîtront dans le tableau de bord

### Vérifier les données

1. Vérifiez que vos comptes apparaissent dans "Comptes bancaires"
2. Vérifiez que les transactions sont listées dans "Transactions récentes"
3. La balance totale doit s'afficher correctement

## 5. Sécurité et Production

### Avant de déployer en production

- [ ] Changez toutes les variables d'environnement pour la production
- [ ] Activez les politiques de sécurité Supabase (RLS déjà configuré)
- [ ] Configurez un domaine personnalisé
- [ ] Activez HTTPS
- [ ] Configurez les webhooks Plaid pour la synchronisation automatique
- [ ] Ajoutez une surveillance des erreurs (Sentry, etc.)
- [ ] Configurez les sauvegardes de la base de données

### Variables d'environnement de production

Ne commitez JAMAIS vos clés API ! Le fichier `.env` est déjà dans `.gitignore`.

## 6. Dépannage

### Erreur de connexion à Supabase

- Vérifiez que vos clés API sont correctes
- Vérifiez que le schéma SQL a bien été exécuté
- Vérifiez que les politiques RLS sont activées

### Erreur Plaid

- Vérifiez que vous êtes bien en mode `sandbox`
- Vérifiez vos identifiants Plaid
- Vérifiez que vous utilisez bien les identifiants de test

### Les transactions ne s'affichent pas

- Vérifiez que le compte a bien été connecté
- Vérifiez dans Supabase que les données sont bien enregistrées
- Regardez les logs de la console du navigateur

## Support

Pour toute question ou problème, consultez :
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Plaid](https://plaid.com/docs/)
- [Documentation Next.js](https://nextjs.org/docs)
