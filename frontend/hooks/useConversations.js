"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook personnalisé pour gérer les conversations.
 * Gère la liste, la création et la suppression des conversations.
 */
export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les conversations au montage
  useEffect(() => {
    fetchConversations();
  }, []);

  /**
   * Récupère toutes les conversations depuis l'API.
   */
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();

      if (response.ok) {
        setConversations(data.conversations);
        // Sélectionner la première conversation si aucune n'est active
        if (data.conversations.length > 0 && !activeId) {
          setActiveId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error("Erreur chargement conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [activeId]);

  /**
   * Crée une nouvelle conversation et la sélectionne.
   */
  const createConversation = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok) {
        setConversations((prev) => [data.conversation, ...prev]);
        setActiveId(data.conversation.id);
        return data.conversation;
      }
    } catch (err) {
      console.error("Erreur création conversation:", err);
    }
    return null;
  }, []);

  /**
   * Supprime une conversation.
   * @param {number} id - L'ID de la conversation à supprimer.
   */
  const deleteConversation = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/conversations?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setConversations((prev) => {
          const remaining = prev.filter((c) => c.id !== id);
          // Si on supprime la conversation active, sélectionner la première restante
          if (activeId === id) {
            setActiveId(remaining.length > 0 ? remaining[0].id : null);
          }
          return remaining;
        });
      }
    } catch (err) {
      console.error("Erreur suppression conversation:", err);
    }
  }, [activeId]);

  /**
   * Sélectionne une conversation.
   * @param {number} id - L'ID de la conversation.
   */
  const selectConversation = useCallback((id) => {
    setActiveId(id);
  }, []);

  /**
   * Rafraîchit la liste des conversations (après envoi d'un message par ex.)
   */
  const refreshConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();
      if (response.ok) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error("Erreur rafraîchissement conversations:", err);
    }
  }, []);

  return {
    conversations,
    activeId,
    loading,
    createConversation,
    deleteConversation,
    selectConversation,
    refreshConversations,
  };
}
