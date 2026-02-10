"use client";

import { useEffect, useRef } from "react";

/**
 * Effet Matrix — pluie de caractères verts sur un canvas plein écran.
 * Se redimensionne automatiquement et tourne en boucle.
 */
export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Caractères utilisés (katakana + chiffres + symboles)
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
      "0123456789" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "@#$%^&*()+=<>{}[]|/\\";

    const fontSize = 14;
    let columns;
    let drops;

    /** Initialise / réinitialise les colonnes */
    function init() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.random() * -100
      );
    }

    init();

    /** Dessine une frame */
    function draw() {
      // Fond semi-transparent pour l'effet de traînée
      ctx.fillStyle = "rgba(13, 13, 13, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < columns; i++) {
        const charIndex = Math.floor(Math.random() * chars.length);
        const char = chars[charIndex];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Tête de colonne : vert vif avec glow
        if (y > 0 && y < canvas.height) {
          // Caractère principal (tête) — blanc-vert brillant
          ctx.fillStyle = "rgba(180, 255, 180, 0.9)";
          ctx.fillText(char, x, y);

          // Caractère juste derrière — vert neon
          if (drops[i] > 1) {
            const prevChar = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = "rgba(0, 255, 65, 0.6)";
            ctx.fillText(prevChar, x, y - fontSize);
          }

          // Queue — vert sombre
          if (drops[i] > 2) {
            const tailChar = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = "rgba(0, 255, 65, 0.15)";
            ctx.fillText(tailChar, x, y - fontSize * 2);
          }
        }

        // Reset quand la goutte atteint le bas
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    // Resize handler
    function handleResize() {
      init();
      // Effacer le canvas après resize
      ctx.fillStyle = "#0D0D0D";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-rain"
      aria-hidden="true"
    />
  );
}
