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

# Générer le client Prisma
RUN npx prisma generate --schema=backend/prisma/schema.prisma

# Appliquer le schéma à la base de données
RUN npx prisma db push --schema=backend/prisma/schema.prisma

# Construire l'application Next.js
RUN npm run build

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["npm", "start"]
