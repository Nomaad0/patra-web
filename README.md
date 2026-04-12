# PaTra — Tracker Patrimonial

> L'alternative honnête à Finary. Gratuit, simple, tes données chez toi.

**[→ Accéder à l'app](https://patra-web-phi.vercel.app/)**

---

## C'est quoi

PaTra est un outil de suivi patrimonial pensé pour les investisseurs français qui ont un PEA, du crypto, des livrets — et qui n'ont pas envie de donner accès à leur banque à une startup.

- Pas de compte obligatoire
- Pas d'abonnement
- Tes données restent dans ton navigateur (localStorage)
- Cours en temps réel via Yahoo Finance & CoinGecko

---

## Features

- **Dashboard** — patrimoine total, plus-values, répartition par poche
- **PEA / CTO** — suivi ligne par ligne, cours auto, benchmark vs CAC 40 / S&P 500 / MSCI World
- **Crypto** — cours CoinGecko, PV/MV en temps réel
- **Livrets** — A, LDDS, LEP et autres
- **Dividendes** — historique, projection annuelle
- **Transactions** — journal d'achat/vente
- **Objectif 1M€** — projection avec taux d'épargne et rendement cible
- **Snapshots** — photo du patrimoine à date pour suivre l'évolution
- **Benchmark base 100** — comparer sa perf aux indices
- **Export CSV / Backup JSON** — tes données t'appartiennent
- Mode sombre / clair

---

## Stack

- React 19 (Create React App)
- Recharts
- Lucide Icons
- Yahoo Finance via corsproxy.io
- CoinGecko API (public, sans clé)
- localStorage — zéro backend

---

## Lancer en local

```bash
git clone https://github.com/Nomaad0/patra-web.git
cd patra-web
npm install
npm start
```

Ouvre [http://localhost:3000](http://localhost:3000).

---

## Philosophie

Finary c'est bien fait mais c'est 8€/mois, ça demande un accès bancaire, et ça tourne sur leurs serveurs. PaTra c'est l'inverse : open source, gratuit, données locales. Tu exportes ton JSON, tu le gardes où tu veux.

---

## Contribuer

Issues et PRs bienvenues. Pas de feuille de route publique pour l'instant — l'app fait ce qu'elle fait, et elle le fait bien.

---

*Fait par un investisseur français pour des investisseurs français.*
