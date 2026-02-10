"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../backend/lib/supabase-browser.js";

/**
 * Hook personnalisé pour gérer l'authentification Supabase.
 * Gère l'état utilisateur, la connexion, l'inscription, la déconnexion
 * et la mise à jour du profil.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supabase] = useState(() => createClient());

  // Vérifier la session au montage du composant
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError("Supabase n'est pas configuré. Vérifiez vos variables d'environnement.");
      return;
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  /**
   * Connexion avec email et mot de passe.
   */
  const signIn = useCallback(async (email, password) => {
    if (!supabase) return;
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }, [supabase]);

  /**
   * Inscription avec email et mot de passe.
   */
  const signUp = useCallback(async (email, password) => {
    if (!supabase) return;
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }, [supabase]);

  /**
   * Met à jour le profil de l'utilisateur.
   * @param {object} updates - Les champs à mettre à jour.
   * @param {string} [updates.displayName] - Nouveau nom d'affichage.
   * @param {string} [updates.email] - Nouvel email.
   * @param {string} [updates.password] - Nouveau mot de passe.
   * @returns {Promise<{success: boolean}>}
   */
  const updateProfile = useCallback(async ({ displayName, email, password }) => {
    if (!supabase) return { success: false };
    setError(null);

    const updateData = {};

    // Mettre à jour l'email si fourni
    if (email && email !== user?.email) {
      updateData.email = email;
    }

    // Mettre à jour le mot de passe si fourni
    if (password) {
      updateData.password = password;
    }

    // Mettre à jour le nom d'affichage dans les métadonnées
    if (displayName !== undefined) {
      updateData.data = {
        ...user?.user_metadata,
        display_name: displayName,
      };
    }

    // Si rien à mettre à jour
    if (Object.keys(updateData).length === 0) {
      return { success: true };
    }

    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) {
      setError(error.message);
      return { success: false };
    }

    setUser(data.user);
    return { success: true };
  }, [supabase, user]);

  /**
   * Upload une photo de profil dans Supabase Storage et met à jour les métadonnées.
   * @param {File} file - Le fichier image à uploader.
   * @returns {Promise<{success: boolean}>}
   */
  const uploadAvatar = useCallback(async (file) => {
    if (!supabase || !user) return { success: false };
    setError(null);

    // Créer un nom de fichier unique basé sur l'ID utilisateur
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    // Upload dans le bucket "avatars"
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      return { success: false };
    }

    // Récupérer l'URL publique
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Ajouter un timestamp pour forcer le rafraîchissement du cache navigateur
    const avatarUrl = urlData.publicUrl + "?t=" + Date.now();

    // Sauvegarder l'URL dans les métadonnées utilisateur
    const { data, error: updateError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        avatar_url: avatarUrl,
      },
    });

    if (updateError) {
      setError(updateError.message);
      return { success: false };
    }

    setUser(data.user);
    return { success: true };
  }, [supabase, user]);

  /**
   * Déconnexion.
   */
  const signOut = useCallback(async () => {
    if (!supabase) return;
    setError(null);
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar,
  };
}
