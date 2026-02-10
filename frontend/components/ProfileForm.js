"use client";

import { useState, useRef } from "react";

/**
 * Profile — terminal aesthetic.
 */
export default function ProfileForm({ user, onUpdateProfile, onUploadAvatar, onBack, error }) {
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = (displayName || email || "?").charAt(0).toUpperCase();

  const handleAvatarClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLocalError("ERR: format invalide. Attendu: image/*");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setLocalError("ERR: taille max dépassée (2 Mo)");
      return;
    }

    setLocalError(null);
    setSuccess(null);
    setUploading(true);

    const result = await onUploadAvatar(file);

    if (result.success) {
      setSuccess("OK: avatar updated");
    }

    setUploading(false);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);

    if (password && password !== confirmPassword) {
      setLocalError("ERR: password mismatch");
      return;
    }

    setSaving(true);

    const updates = {};

    if (displayName !== (user?.user_metadata?.display_name || "")) {
      updates.displayName = displayName;
    }

    if (email !== user?.email) {
      updates.email = email;
    }

    if (password) {
      updates.password = password;
    }

    if (Object.keys(updates).length === 0) {
      setLocalError("WARN: no changes detected");
      setSaving(false);
      return;
    }

    const result = await onUpdateProfile(updates);

    if (result.success) {
      setSuccess("OK: profile updated");
      setPassword("");
      setConfirmPassword("");
    }

    setSaving(false);
  };

  const displayError = localError || error;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button className="profile-back-button" onClick={onBack}>
            &lt;-- back
          </button>
          <h1>user.config</h1>
        </div>

        {displayError && (
          <div className="profile-error">{displayError}</div>
        )}

        {success && (
          <div className="profile-success">{success}</div>
        )}

        <div className="profile-avatar">
          <button
            type="button"
            className="profile-avatar-upload"
            onClick={handleAvatarClick}
            disabled={uploading}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="profile-avatar-image"
              />
            ) : (
              <div className="profile-avatar-circle">{initials}</div>
            )}
            <div className="profile-avatar-overlay">
              {uploading ? "..." : "edit"}
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="profile-avatar-input"
          />
          <p className="profile-avatar-email">{user?.email}</p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-section">
            <h2>-- identity</h2>

            <div className="profile-field">
              <label htmlFor="displayName">name &gt;</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="_"
                disabled={saving}
              />
            </div>

            <div className="profile-field">
              <label htmlFor="email">email &gt;</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="_"
                disabled={saving}
              />
            </div>
          </div>

          <div className="profile-section">
            <h2>-- password</h2>

            <div className="profile-field">
              <label htmlFor="password">new &gt;</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="_"
                disabled={saving}
              />
            </div>

            <div className="profile-field">
              <label htmlFor="confirmPassword">confirm &gt;</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="_"
                disabled={saving}
              />
            </div>
          </div>

          <button
            type="submit"
            className="profile-save-button"
            disabled={saving}
          >
            {saving ? "[ SAVING... ]" : "[ SAVE ]"}
          </button>
        </form>
      </div>
    </div>
  );
}
