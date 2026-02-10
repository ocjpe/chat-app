FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du projet
COPY . .

# Créer le répertoire data pour SQLite
RUN mkdir -p data

# Générer le client Prisma (ne nécessite pas de connexion DB)
RUN npx prisma generate --schema=backend/prisma/schema.prisma

# Fournir un DATABASE_URL temporaire pour le build Next.js
ENV DATABASE_URL="file:../../data/app.db"

# Construire l'application Next.js
RUN npm run build

# Exposer le port
EXPOSE 3000

# Au démarrage : appliquer le schéma à la DB puis lancer l'app
CMD npx prisma db push --schema=backend/prisma/schema.prisma && npm start
