FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN mkdir -p data

RUN npx prisma generate --schema=backend/prisma/schema.prisma


ARG NEXT_PUBLIC_SUPABASE_URL=""
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=""
ARG GROQ_API_KEY=""

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV GROQ_API_KEY=$GROQ_API_KEY
ENV DATABASE_URL="file:../../data/app.db"

RUN npm run build

EXPOSE 3000

CMD npx prisma db push --schema=backend/prisma/schema.prisma && npm start
