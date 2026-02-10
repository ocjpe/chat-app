"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook personnalisé pour gérer la logique du chat.
 * Supporte les conversations multiples via conversationId.
 */
export function useChat(conversationId, onMessageSent) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref pour ignorer le fetch automatique quand on vient de créer
  // une conversation et qu'on envoie le premier message en même temps.
  const skipNextFetchRef = useRef(false);

  // Charger les messages quand la conversation change
  useEffect(() => {
    if (conversationId) {
      if (skipNextFetchRef.current) {
        // On vient de créer la conversation + sendMessage est déjà en cours → pas de fetch
        skipNextFetchRef.current = false;
        return;
      }
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  /**
   * Récupère les messages de la conversation active.
   */
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(`/api/chat?conversationId=${conversationId}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages);
      } else {
        setError(data.error || "Erreur lors du chargement des messages.");
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur.");
    }
  }, [conversationId]);

  /**
   * Envoie un message utilisateur et récupère la réponse de l'IA.
   * @param {string} content - Le contenu du message.
   * @param {number} [overrideConversationId] - ID de conversation à utiliser
   *   (utile quand la conversation vient d'être créée et que le state n'est pas encore à jour).
   */
  const sendMessage = useCallback(async (content, overrideConversationId) => {
    const targetId = overrideConversationId || conversationId;
    if (!content || content.trim() === "" || !targetId) return;

    // Si on utilise un override, le useEffect va se déclencher quand activeId
    // sera mis à jour → on lui dit d'ignorer le fetch pour éviter le doublon.
    if (overrideConversationId) {
      skipNextFetchRef.current = true;
    }

    const tempUserMessage = {
      id: "temp-" + Date.now(),
      content: content,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, conversationId: targetId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev.filter((msg) => msg.id !== tempUserMessage.id),
          data.userMessage,
          data.aiMessage,
        ]);
        // Notifier le parent pour rafraîchir la liste des conversations (titre mis à jour)
        if (onMessageSent) onMessageSent();
      } else {
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== tempUserMessage.id)
        );
        setError(data.error || "Erreur lors de l'envoi du message.");
      }
    } catch (err) {
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id)
      );
      setError("Impossible d'envoyer le message.");
    } finally {
      setLoading(false);
    }
  }, [conversationId, onMessageSent]);

  /**
   * Efface le message d'erreur.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    clearError,
    sendMessage,
  };
}
