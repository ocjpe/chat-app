"use client";

import { useChat } from "../hooks/useChat.js";
import { useConversations } from "../hooks/useConversations.js";
import Sidebar from "./Sidebar.js";
import MessageList from "./MessageList.js";
import MessageInput from "./MessageInput.js";
import MatrixRain from "./MatrixRain.js";

/**
 * Layout principal — sidebar + terminal chat + Matrix rain background.
 */
export default function Chat({ user, onSignOut, onOpenProfile }) {
  const {
    conversations,
    activeId,
    createConversation,
    deleteConversation,
    selectConversation,
    refreshConversations,
  } = useConversations();

  const { messages, loading, error, clearError, sendMessage } = useChat(
    activeId,
    refreshConversations
  );

  const handleNewConversation = async () => {
    await createConversation();
  };

  const handleSendMessage = async (content) => {
    if (!activeId) {
      const conv = await createConversation();
      if (!conv) return;
      // Passer l'ID directement pour éviter le problème de closure stale
      sendMessage(content, conv.id);
      return;
    }
    sendMessage(content);
  };

  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNew={handleNewConversation}
        onDelete={deleteConversation}
        onOpenProfile={onOpenProfile}
        onSignOut={onSignOut}
      />

      <div className="chat-container">
        <MatrixRain />

        <div className="chat-content">
          {error && (
            <div className="chat-error">
              <span className="chat-error-prefix">ERR &gt;</span>
              <p>{error}</p>
              <button className="chat-error-close" onClick={clearError}>
                [x]
              </button>
            </div>
          )}

          <MessageList
            messages={messages}
            loading={loading}
            onSendSuggestion={handleSendMessage}
          />

          <MessageInput onSend={handleSendMessage} loading={loading} />
        </div>
      </div>
    </div>
  );
}
