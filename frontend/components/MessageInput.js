"use client";

import { useState, useRef, useEffect } from "react";

export default function MessageInput({ onSend, loading }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <span className="input-prompt">&gt;</span>
      <input
        ref={inputRef}
        type="text"
        className="message-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={loading ? "processing..." : ""}
        disabled={loading}
        autoFocus
      />
      <button
        type="submit"
        className="message-send-button"
        disabled={loading || !input.trim()}
      >
        {loading ? "..." : "SEND"}
      </button>
    </form>
  );
}
