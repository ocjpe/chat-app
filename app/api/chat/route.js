import { NextResponse } from "next/server";
import { saveMessage, getMessages } from "../../../backend/services/messageService.js";
import { getAIResponse } from "../../../backend/services/aiService.js";
import { updateConversationTitle } from "../../../backend/services/conversationService.js";

/**
 * GET /api/chat?conversationId=1
 * Récupère l'historique des messages d'une conversation.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = parseInt(searchParams.get("conversationId"));

    if (!conversationId) {
      return NextResponse.json(
        { error: "ID de conversation requis." },
        { status: 400 }
      );
    }

    const messages = await getMessages(conversationId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat
 * Envoie un message utilisateur, obtient une réponse IA, sauvegarde les deux.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, conversationId } = body;

    // Vérifications
    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Le message ne peut pas être vide." },
        { status: 400 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: "ID de conversation requis." },
        { status: 400 }
      );
    }

    // Sauvegarder le message de l'utilisateur
    const userMessage = await saveMessage(message.trim(), "user", conversationId);

    // Récupérer l'historique pour le contexte IA
    const allMessages = await getMessages(conversationId);
    const chatHistory = allMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Obtenir la réponse de l'IA
    const aiResponseContent = await getAIResponse(chatHistory);

    // Sauvegarder la réponse de l'IA
    const aiMessage = await saveMessage(aiResponseContent, "assistant", conversationId);

    // Mettre à jour le titre de la conversation avec le premier message
    if (allMessages.length <= 1) {
      const title = message.trim().substring(0, 40) + (message.trim().length > 40 ? "..." : "");
      await updateConversationTitle(conversationId, title);
    }

    return NextResponse.json({
      userMessage,
      aiMessage,
    });
  } catch (error) {
    console.error("Erreur lors du traitement du message :", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du message." },
      { status: 500 }
    );
  }
}
