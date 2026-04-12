# PaTra — Tracker Patrimonial pour Investisseurs Français

## Qu'est-ce que PaTra

App React (~1500 lignes) de suivi patrimonial pour investisseurs français (PEA + Crypto). Anciennement Electron, en cours de migration vers web app pure.

## Cible

Investisseurs français 25-40 ans : PEA + crypto, anti-abonnement, anti-connexion bancaire, traînent sur r/vosfinances et Twitter finance FR.

**Positionnement** : "L'alternative honnête à Finary — gratuit, simple, tes données chez toi."

## Stack technique

- React 19 (Create React App) — **NE PAS migrer vers Next.js, Vite ou autre**
- Recharts (graphiques)
- Lucide Icons
- Yahoo Finance via corsproxy.io (cours actions)
- CoinGecko API (cours crypto)
- localStorage pour la persistance (clé `patrimoine-v6`)
- Déploiement : Vercel (compte Nomaad0)

## Architecture données

### Couche 1 — localStorage (toujours actif)

- L'utilisateur arrive DIRECTEMENT sur le dashboard, pas de login
- Toutes les données dans localStorage
- App 100% fonctionnelle sans compte

### Couche 2 — Supabase (optionnel, pas encore implémenté)

- Bouton optionnel "Créer un compte pour sauvegarder"
- Auth email + mot de passe uniquement (pas d'OAuth)
- Table unique `user_data` : user_id + JSON patrimoine + updated_at
- Sync : save → localStorage + Supabase (si connecté). Load → Supabase (si connecté), sinon localStorage.

## Design

- Thème sombre par défaut (bg `#060a11`, card `#0d1321`, accent `#4f8ff7`, green `#00d67e`)
- Mode clair disponible
- Polices : Outfit (texte), JetBrains Mono (chiffres)
- Style : cartes bordures subtiles, coins arrondis 12-16px, espacement généreux
- Utiliser les variables `C.bg`, `C.card`, `C.accent`, etc. du thème existant

## Features existantes (GRATUITES)

- Dashboard unifié (patrimoine total, PV, répartition)
- Onglets : PEA, CTO, Crypto, Livrets, Dividendes, Objectif 1M€, Transactions
- Benchmark base 100 vs CAC 40, S&P 500, MSCI World
- Snapshots, taux d'épargne, alertes rééquilibrage
- Courbe valeur portefeuille vs capital investi
- Backup/Restore JSON, Export CSV
- Mode sombre/clair, Onboarding 5 étapes
- Lignes ILLIMITÉES

## Features PRO (À IMPLÉMENTER PLUS TARD)

Multi-portefeuilles, import CSV brokers, export PDF, fiscalité PEA vs CTO, projections avancées. Paiement one-shot 10€ via Gumroad/LemonSqueezy. **Le système Pro N'EST PAS à implémenter maintenant.**

## Règles strictes

- **NE PAS** refactorer ou réécrire le code existant sauf demande explicite
- **NE PAS** migrer vers Next.js, Vite ou autre framework
- **NE PAS** ajouter de features non demandées
- **NE PAS** rendre le login obligatoire — JAMAIS de mur d'auth
- **NE PAS** mettre de limites artificielles sur le plan gratuit
- **NE PAS** ajouter de dépendances inutiles
- Toute modif doit être **minimale et ciblée**
- **Demander confirmation AVANT de modifier `patrimoine-tracker.jsx`** (fichier critique)
- Toute nouvelle UI utilise les variables du thème existant

## Roadmap

### Phase 1 — Adapter pour le web (MAINTENANT)

1. Virer les restes Electron (`electron.js`, `electron-main.js`, `splash.html`, devDependencies electron)
2. Vérifier que localStorage fonctionne
3. Tester `npm start` + `localhost:3000`
4. Déployer sur Vercel

### Phase 2 — Auth optionnelle Supabase

1. Créer le projet Supabase
2. Bouton "Créer un compte" optionnel
3. Sync localStorage ↔ Supabase
4. Redéployer

### Phase 3 — Release public

1. Nettoyer le code pour repo GitHub public
2. README avec screenshots
3. Données de démo pour nouveaux utilisateurs
4. Bouton discret "Soutenir PaTra — 10€"

### Phase 4 — Distribution

Posts r/vosfinances, r/CryptoFR, Twitter/X finance FR → retours → itérer

### Phase 5 — Features Pro + monétisation

Implémenter features Pro, intégrer paiement, système de licence.

## Prochaine action

Commence par la Phase 1. Confirme que tu vois les fichiers, vérifie leur état, montre chaque modif avant de l'appliquer.
