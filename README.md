# Chat IA
Application de chat web avec intelligence artificielle, construite avec Next.js, SQLite et l'API Groq.

## Contributeurs
Océane JOPPE

## Fonctionnement de l'application

L'application permet à un utilisateur de discuter avec une intelligence artificielle :

1. L'utilisateur se connecte ou crée un compte via Supabase (email + mot de passe)
2. Il écrit un message dans le champ de texte et l'envoie
3. Le message est envoyé au serveur via l'API `/api/chat`
4. Le serveur sauvegarde le message dans la base de données SQLite
5. Le serveur envoie le message à l'API Groq (modèle LLama 3.3 70B) pour obtenir une réponse
6. La réponse de l'IA est sauvegardée dans la base de données
7. Les deux messages (utilisateur + IA) sont renvoyés au frontend et affichés à l'écran

## Technologies utilisées

- **Framework** : Next.js (App Router)
- **Langage** : JavaScript
- **Frontend** : React
- **Backend** : API Routes Next.js
- **Base de données** : SQLite
- **ORM** : Prisma
- **IA** : API Groq
- **Authentification** : Supabase
- **Containerisation** : Docker

## Structure des dossiers

```
chat-app/
├── frontend/                 # Interface utilisateur (React)
│   ├── components/           # Composants React
│   │   ├── Chat.js           # Composant principal du chat
│   │   ├── LoginForm.js      # Formulaire de connexion / inscription
│   │   ├── MessageList.js    # Affichage de la liste des messages
│   │   └── MessageInput.js   # Champ de saisie et bouton d'envoi
│   ├── hooks/                # Logique frontend
│   │   ├── useChat.js        # Gestion des messages et appels API
│   │   └── useAuth.js        # Gestion de l'authentification
│   └── styles/               # Fichiers CSS
│       ├── chat.css          # Styles du chat
│       └── login.css         # Styles de la page de connexion
│
├── backend/                  # Logique serveur
│   ├── services/             # Fonctions métier
│   │   ├── messageService.js # Sauvegarde et récupération des messages
│   │   └── aiService.js      # Appel à l'API Groq
│   ├── lib/                  # Outils et connexions
│   │   ├── prisma.js         # Client Prisma (SQLite)
│   │   ├── supabase-browser.js # Client Supabase côté navigateur
│   │   └── supabase-server.js  # Client Supabase côté serveur
│   └── prisma/               # Configuration base de données
│       └── schema.prisma     # Schéma Prisma (modèle Message)
│
├── app/                      # Next.js App Router
│   ├── api/chat/             # Route API
│   │   └── route.js          # GET (historique) et POST (envoi + réponse IA)
│   ├── page.js               # Page principale (login ou chat)
│   ├── layout.js             # Layout racine
│   └── globals.css           # Styles globaux
│
├── data/                     # Base de données SQLite
│   └── app.db
│
├── Dockerfile                # Configuration Docker
├── package.json              # Dépendances et scripts
└── README.md                 # Ce fichier
```

## Prérequis

- Node.js 20+
- Un compte [Groq](https://console.groq.com/) pour obtenir une clé API
- Un projet [Supabase](https://supabase.com/) pour l'authentification

## Installation et lancement

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd chat-app
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```
DATABASE_URL="file:../../data/app.db"
GROQ_API_KEY=votre-cle-api-groq
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-supabase
```

- **GROQ_API_KEY** : disponible sur [console.groq.com](https://console.groq.com/) > API Keys
- **NEXT_PUBLIC_SUPABASE_URL** et **NEXT_PUBLIC_SUPABASE_ANON_KEY** : disponibles sur le dashboard Supabase > Settings > API

### 4. Initialiser la base de données

```bash
npx prisma generate --schema=backend/prisma/schema.prisma
npx prisma db push --schema=backend/prisma/schema.prisma
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Lancement avec Docker

```bash
docker build -t chat-app .
docker run -p 3000:3000 chat-app
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).
