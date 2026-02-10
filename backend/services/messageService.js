import prisma from "../lib/prisma.js";

/**
 * Sauvegarde un message dans une conversation.
 * @param {string} content - Le contenu du message.
 * @param {string} role - Le rôle ("user" ou "assistant").
 * @param {number} conversationId - L'ID de la conversation.
 * @returns {Promise<object>} Le message sauvegardé.
 */
export async function saveMessage(content, role, conversationId) {
  const message = await prisma.message.create({
    data: {
      content,
      role,
      conversationId,
    },
  });

  // Mettre à jour la date de la conversation
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

/**
 * Récupère tous les messages d'une conversation triés par date.
 * @param {number} conversationId - L'ID de la conversation.
 * @returns {Promise<Array>} La liste des messages.
 */
export async function getMessages(conversationId) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: {
      createdAt: "asc",
    },
  });
  return messages;
}
