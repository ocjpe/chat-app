"use client";

import { useState } from "react";

/**
 * Login — terminal aesthetic.
 */
export default function LoginForm({ onSignIn, onSignUp, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (isSignUp) {
      onSignUp(email, password);
    } else {
      onSignIn(email, password);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <pre className="login-ascii">{`
┌─────────────────────────────────┐
│         CHAT-IA v1.0.0          │
│      authentication required    │
└─────────────────────────────────┘`}</pre>

        <div className="login-mode">
          <span className="login-mode-label">mode:</span>
          <span className="login-mode-value">{isSignUp ? "register" : "login"}</span>
        </div>

        {error && (
          <div className="login-error">
            <span className="login-error-prefix">ERR &gt;</span> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">email &gt;</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="_"
              disabled={loading}
              required
              autoFocus
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">password &gt;</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="_"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? (
              <span className="login-spinner">...</span>
            ) : isSignUp ? (
              "[ REGISTER ]"
            ) : (
              "[ LOGIN ]"
            )}
          </button>
        </form>

        <div className="login-switch">
          <button
            type="button"
            className="login-switch-button"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
          >
            {isSignUp ? "> switch to login" : "> switch to register"}
          </button>
        </div>
      </div>
    </div>
  );
}
