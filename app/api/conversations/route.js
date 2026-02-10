import { NextResponse } from "next/server";
import {
  getConversations,
  createConversation,
  deleteConversation,
} from "../../../backend/services/conversationService.js";

/**
 * GET /api/conversations
 * Récupère la liste de toutes les conversations.
 */
export async function GET() {
  try {
    const conversations = await getConversations();
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des conversations." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Crée une nouvelle conversation.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const conversation = await createConversation(body.title);
    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Erreur lors de la création de la conversation :", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la conversation." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/conversations
 * Supprime une conversation par son ID.
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "ID de conversation requis." },
        { status: 400 }
      );
    }

    await deleteConversation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de la conversation :", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la conversation." },
      { status: 500 }
    );
  }
}
