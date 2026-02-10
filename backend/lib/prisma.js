import { PrismaClient } from "@prisma/client";

/**
 * Client Prisma — singleton paresseux.
 * Évite de créer le client au moment de l'import (build time).
 */
let prisma;

function getPrismaClient() {
  if (!prisma) {
    if (process.env.NODE_ENV === "production") {
      prisma = new PrismaClient();
    } else {
      if (!global.__prisma) {
        global.__prisma = new PrismaClient();
      }
      prisma = global.__prisma;
    }
  }
  return prisma;
}

// Proxy qui délègue tous les accès au client Prisma initialisé paresseusement
export default new Proxy({}, {
  get(_target, prop) {
    return getPrismaClient()[prop];
  },
});
