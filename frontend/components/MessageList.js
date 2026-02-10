"use client";

import { useEffect, useRef } from "react";

const SUGGESTIONS = [
  "Explique-moi comment fonctionne Internet",
  "Donne-moi une recette rapide pour ce soir",
  "Aide-moi à rédiger un email professionnel",
];

/**
 * Terminal-style message list — prefixes USER > / BOT >.
 * Le dernier message reçoit une bordure néon verte à gauche.
 */
export default function MessageList({ messages, loading, onSendSuggestion }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="message-list-empty">
        <pre className="empty-ascii">{`
  ┌──────────────────────────┐
  │     TERMINAL  READY      │
  │     awaiting input...    │
  └──────────────────────────┘
`}</pre>
        <p className="empty-subtitle">
          Tapez une commande ou sélectionnez :
        </p>
        <div className="empty-suggestions">
          {SUGGESTIONS.map((text, i) => (
            <button
              key={i}
              className="empty-suggestion"
              onClick={() => onSendSuggestion(text)}
            >
              <span className="empty-suggestion-arrow">&gt;</span> {text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const lastId = messages.length > 0 ? messages[messages.length - 1].id : null;

  return (
    <div className="message-list">
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const isActive = msg.id === lastId;

        return (
          <div
            key={msg.id}
            className={`message ${isUser ? "message-user" : "message-bot"} ${isActive ? "message-active" : ""}`}
          >
            <span className="message-time">
              {new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className={`message-prefix ${isUser ? "prefix-user" : "prefix-bot"}`}>
              {isUser ? "USER" : " BOT"} &gt;
            </span>
            <span className="message-content">{msg.content}</span>
          </div>
        );
      })}

      {loading && (
        <div className="message message-bot message-active">
          <span className="message-time">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="message-prefix prefix-bot">&nbsp;BOT &gt;</span>
          <span className="message-content typing-text">
            <span className="cursor-blink">_</span>
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
