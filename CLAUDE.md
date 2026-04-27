# PaTra — Tracker Patrimonial pour Investisseurs Français

## Qu'est-ce que PaTra

App React (~1600 lignes) de suivi patrimonial pour investisseurs français (PEA + Crypto). Anciennement Electron, migré vers web app pure sur Vercel.

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
- Déploiement : Vercel (compte Nomaad0) — `patra-web-phi.vercel.app`

## Architecture données

### Couche 1 — localStorage (toujours actif)

- Première visite → landing page (`showLanding` state)
- Données dans localStorage, app 100% fonctionnelle sans compte

### Couche 2 — Supabase (optionnel, pas encore implémenté)

- Bouton optionnel "Créer un compte pour sauvegarder"
- Auth email + mot de passe uniquement (pas d'OAuth)
- Table unique `user_data` : user_id + JSON patrimoine + updated_at

## Design

- Thème sombre par défaut (bg `#060a11`, card `#0d1321`, accent `#4f8ff7`, green `#00d67e`)
- **Purple : `#A855F7`** (important : pas `#7c3aed` — aligné header + landing)
- Mode clair disponible
- Polices : Outfit (texte), JetBrains Mono (chiffres/tags)
- Style : cartes bordures subtiles, coins arrondis 12-16px, espacement généreux
- Utiliser les variables `C.bg`, `C.card`, `C.accent`, `C.purple`, etc. du thème existant

## DA Header (important)

Le header utilise un style "ticker financier" :
- Nom PaTra + tag `PATRIMOINE` (JetBrains Mono, border purple)
- Sparkline SVG 120×28 (path à 8 points, L commands — pas de bezier)
  - Path : `M0,22 L15,15 L28,12 L48,26 L58,20 L72,10 L88,5 L120,1`
  - Démarre bas, monte, gros dip, forte reprise finale
- Delta `▲ 4.2%` hardcodé en purple
- Badges sync PEA/CTO/Crypto en JetBrains Mono
- **La landing page partage la même DA** : même ticker dans la nav, même sparkline, gradient bleu→violet sur le h1

## Fichiers publics importants

- `public/landing.html` — page de présentation (lien à partager pour la distribution)
- `public/og-image.png` — image sociale 1200×630
- `public/app-screenshot.png` — screenshot du dashboard pour la landing
- `public/og-preview.html` — template pour regénérer og-image
- `public/app-screenshot.html` — template pour regénérer le screenshot
- `public/patra-logo.svg` — logo SVG (barres croissantes, fond `#0E1430`)
- `public/favicon.png` + `public/favicon.ico` — favicon (ICO généré depuis PNG 256×256)

## Features existantes (GRATUITES)

- Dashboard unifié (patrimoine total, PV, répartition)
- Onglets : PEA, CTO, Crypto, Livrets, Dividendes, Objectif, Transactions
- Benchmark base 100 vs CAC 40, S&P 500, MSCI World
- Snapshots, taux d'épargne, alertes rééquilibrage
- Courbe valeur portefeuille vs capital investi
- Backup/Restore JSON, Export CSV (avec section transactions + BOM UTF-8)
- Mode sombre/clair, Onboarding 5 étapes
- Lignes ILLIMITÉES
- Transactions liées aux onglets (achat/vente met à jour le portefeuille + recalcule PRU)
- Tri + filtre sur le tableau transactions
- Persistance de l'onglet actif sur F5 (localStorage `patra-tab`)
- Objectif modulable (persisté dans `patra-goal`)
- Menu Paramètres (dropdown) : Backup, Restore, Export CSV, Mode sombre/clair, Réinitialiser
- Cash espèces PEA / CTO / Crypto (éditable inline)
- Stablecoins dans l'onglet Crypto (`stablecoins: [{id, symbol, quantity}]`)
- Gestion cash sur transactions (architecture delta, validation inline, bouton grisé)
- cashDelta visible dans l'historique transactions (sous le total)
- Landing page pour nouveaux visiteurs (`showLanding` state, `sessionStorage` pour "Voir la démo")
- Header ticker : sparkline + PATRIMOINE tag + delta + badges sync
- og:image + meta tags (Open Graph + Twitter Card)
- Favicon SVG + PNG + ICO (compatible Safari)

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
- Purple = `#A855F7` partout (app + landing)

## Roadmap

### Phase 1 ✅ — Migration web
### Phase 2 — Auth optionnelle Supabase (pas commencé)
### Phase 3 ✅ — Release public (landing, données démo, og:image, favicon)
### Phase 4 — Distribution (PROCHAINE ÉTAPE)

Posts r/vosfinances, r/CryptoFR, Twitter/X finance FR → retours → itérer
**Lien à partager : `patra-web-phi.vercel.app/landing.html`**

### Phase 5 — Features Pro + monétisation

## Architecture cash (important)

Approche **delta-based** :
- Chaque transaction stocke `cashDelta` (nombre) et `stableDelta` ({symbol, delta})
- État cash : `peaCash`, `ctoCash`, `cryptoCash` (useState), `stablecoins` (array)
- `STABLE_LIST` constante avant le composant

## Marque-page session 2026-04-22

### Fait aujourd'hui
- ✅ Bug cash PEA résolu (affichage dispo dès sélection, validation end-to-end)
- ✅ og:image + meta tags Open Graph / Twitter Card
- ✅ Données démo enrichies et normalisées (127k€, PRU cohérents, PE500 corrigé)
- ✅ Landing page `public/landing.html` (screenshot, "Pour qui ?", comparaison Finary, FAQ)
- ✅ cashDelta visible dans l'historique + transactions dans le CSV
- ✅ Favicon SVG + ICO (compatible tous navigateurs y compris Safari)
- ✅ Logo header → `patra-logo.svg`
- ✅ Header ticker (sparkline, PATRIMOINE tag, delta, badges sync)
- ✅ DA alignée landing ↔ app (purple `#A855F7`, sparkline identique, gradient h1)

### Marque-page session 2026-04-24

### Fait aujourd'hui
- ✅ Reset modal : validation sur Entrée + annulation sur Échap
- ✅ Screenshot landing (`app-screenshot.html`) : banner démo supprimée, 7ème ligne tableau, meilleur cadrage
- ✅ Onboarding : déclenché au premier lancement ("Commencer avec mes données"), bouton "Passer" visible à chaque étape
- ✅ Fix clearDemo : relance l'onboarding après suppression des données démo
- ✅ Fix "Voir la démo" clic milieu : `href="/?demo=1"` + détection URL param dans l'app
- ✅ QA mobile audit : modal responsive (`min(520px, 100vw-32px)`), scroll horizontal Dividendes + Transactions (minWidth 640/680px)

### Marque-page session 2026-04-26

### Fait aujourd'hui
- ✅ Bouton "Voir la démo" landing : style Raycast pill (conic-gradient `--r2`/`--x`, spotlight bleu qui balaie la bordure)
- ✅ Couleurs adaptées PaTra : spotlight `#93c5fd`, fond `#071428`, glow bleu accent `#4f8ff7`
- ✅ Alignement taille avec "Commencer →" : `border-radius: 43px`, `height: 44-46px`, `font-size: 14px`

### Marque-page session 2026-04-26 (suite — audit sécurité)

### Fait aujourd'hui
- ✅ **Audit sécurité complet** (2 passes offensives)
- ✅ CSV formula injection → `csvField()` sanitizer sur tous les champs texte de l'export
- ✅ Proxy API (`/api/quote`, `/api/dividends`) → Referer check (patra.fr + patra-web-phi.vercel.app + www)
- ✅ CORS dynamique sur `/api/*` (multi-domaine)
- ✅ `encodeURIComponent` sur tous les params Yahoo Finance (`period1`, `period2`, `interval`, `range`)
- ✅ `encodeURIComponent` sur chaque `cgId` avant appel CoinGecko (injection URL)
- ✅ Headers HTTP : `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` dans `vercel.json`
- ✅ `rel="noopener noreferrer"` sur les liens `target="_blank"` de la landing
- ✅ Avertissement `window.confirm()` à l'import de backup (source externe)
- ✅ Limite taille backup : 5 Mo max, 500 snapshots max, 10 000 transactions max
- ✅ Alerte si `localStorage` plein (échec silencieux → perte de données)
- ✅ `window.storage` global supprimé de `index.html` (code vestigial inutile)
- ✅ `og-preview.html` + `app-screenshot.html` exclus du déploiement via `.vercelignore`
- ✅ CSP (Content Security Policy) : `script-src 'self'`, `connect-src` CoinGecko, `frame-ancestors 'self'`
- ✅ Script inline landing déplacé vers `public/landing-redirect.js` (requis par CSP)
- ✅ Fix `MetricCard` : chiffres tronqués (`...`) → seuils font-size corrigés (>12→15px, >9→18px, >6→22px)

### Marque-page session 2026-04-28

### Fait aujourd'hui
- ✅ **Feature "maturité fiscale PEA"** : `peaOpenDate` state, date input en bas de l'onglet PEA, calcul 5 ans, PS à 18.6% (LFSS 2026), carte verte "PEA mature" après 5 ans
- ✅ **Feature "quick-add" PEA/CTO** : grille d'instruments populaires + recherche live Yahoo Finance, branche `feat/quick-add`
- ✅ `LogoImg` component (module level) : logos Parqet via ticker, fallback letter avatar, détection placeholder (`naturalWidth<10`)
- ✅ `InstrCard` component (module level) : correction bug remount (était dans IIFE → reset err à chaque render)
- ✅ `api/search.js` : serverless function Yahoo Finance search, filtre suffixes EU/EEE pour PEA
- ✅ Logos ETF : iShares via `BLK` (Parqet), Amundi via Google favicon `amundi.com`
- ✅ LogoImg supporte URLs directes (startsWith "https://")
- ✅ Logos US stocks : AAPL, MSFT, NVDA, AMZN, GOOGL, META, TSLA, JPM, V via Parqet
- ✅ Grilles séparées `QUICK_PEA` / `QUICK_CTO` — PEA : ETFs intercalés actions FR/EU (TTE, MC, AIR, BNP, SAN, ASML, SAP...) — CTO : big caps US en tête
- ✅ Modal élargie 520→640px, logos 34→40px

### Prochaine session
1. **Vérifier feat/quick-add** sur le preview Vercel (logos US stocks Parqet, Amundi favicon, grilles PEA/CTO)
2. **Quick-add Livrets** : grille des livrets réglementés FR (Livret A, LDDS, LEP, PEL, CEL...)
3. **Quick-add Crypto** : grille BTC, ETH, SOL, BNB, ADA, XRP, AVAX, MATIC...
4. Merger `feat/quick-add` → `main` quand tout est validé
5. **Phase 4 Distribution** — poster sur r/vosfinances + Twitter FR (posts dans patra-distribution.html sur le bureau)
