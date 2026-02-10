import prisma from "../lib/prisma.js";

/**
 * Crée une nouvelle conversation.
 * @param {string} [title] - Titre optionnel.
 * @returns {Promise<object>} La conversation créée.
 */
export async function createConversation(title) {
  const conversation = await prisma.conversation.create({
    data: {
      title: title || "Nouvelle discussion",
    },
  });
  return conversation;
}

/**
 * Récupère toutes les conversations triées par date de mise à jour.
 * @returns {Promise<Array>} La liste des conversations.
 */
export async function getConversations() {
  const conversations = await prisma.conversation.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { content: true, role: true },
      },
    },
  });
  return conversations;
}

/**
 * Supprime une conversation et tous ses messages.
 * @param {number} id - L'ID de la conversation.
 * @returns {Promise<object>} La conversation supprimée.
 */
export async function deleteConversation(id) {
  const conversation = await prisma.conversation.delete({
    where: { id },
  });
  return conversation;
}

/**
 * Met à jour le titre d'une conversation.
 * @param {number} id - L'ID de la conversation.
 * @param {string} title - Le nouveau titre.
 * @returns {Promise<object>} La conversation mise à jour.
 */
export async function updateConversationTitle(id, title) {
  const conversation = await prisma.conversation.update({
    where: { id },
    data: { title },
  });
  return conversation;
}
