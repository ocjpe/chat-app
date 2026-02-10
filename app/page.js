"use client";

import { useState, useCallback } from "react";
import { useAuth } from "../frontend/hooks/useAuth.js";
import MatrixIntro from "../frontend/components/MatrixIntro.js";
import LoginForm from "../frontend/components/LoginForm.js";
import Chat from "../frontend/components/Chat.js";
import ProfileForm from "../frontend/components/ProfileForm.js";

/**
 * Page principale.
 * Affiche l'intro Matrix au premier chargement, puis login / chat / profil.
 */
export default function Home() {
  const { user, loading, error, signIn, signUp, signOut, updateProfile, uploadAvatar } = useAuth();
  const [currentPage, setCurrentPage] = useState("chat");
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroDone = useCallback(() => {
    setIntroComplete(true);
  }, []);

  // Intro Matrix — affiché une seule fois au chargement
  if (!introComplete) {
    return <MatrixIntro onComplete={handleIntroDone} />;
  }

  // Écran de chargement pendant la vérification de la session
  if (loading && !user) {
    return (
      <div className="login-page">
        <p style={{ color: "#333" }}>loading...</p>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher le formulaire de connexion
  if (!user) {
    return (
      <LoginForm
        onSignIn={signIn}
        onSignUp={signUp}
        loading={loading}
        error={error}
      />
    );
  }

  // Page profil
  if (currentPage === "profile") {
    return (
      <ProfileForm
        user={user}
        onUpdateProfile={updateProfile}
        onUploadAvatar={uploadAvatar}
        onBack={() => setCurrentPage("chat")}
        error={error}
      />
    );
  }

  // Page chat avec sidebar (par défaut)
  return (
    <Chat
      user={user}
      onSignOut={signOut}
      onOpenProfile={() => setCurrentPage("profile")}
    />
  );
}
