"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Séquence de phrases Matrix tapées une par une avec un caret clignotant.
 * Après la dernière phrase, l'écran disparaît.
 */
const SEQUENCE = [
  { text: "Wake up, Neo...", pause: 1200 },
  { text: "The Matrix has you...", pause: 1400 },
  { text: "Follow the white rabbit.", pause: 2000 },
  { text: "Knock, knock, Neo.", pause: 1600 },
];

const TYPE_SPEED = 70;   // ms par caractère
const CLEAR_SPEED = 600; // pause avant d'effacer la ligne

export default function MatrixIntro({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | pause | clearing | done

  const currentLine = SEQUENCE[lineIndex];

  // Typing effect
  useEffect(() => {
    if (phase !== "typing" || !currentLine) return;

    if (charIndex < currentLine.text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + currentLine.text[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, TYPE_SPEED);
      return () => clearTimeout(timer);
    } else {
      // Finished typing this line → pause
      setPhase("pause");
    }
  }, [phase, charIndex, currentLine]);

  // Pause after typing
  useEffect(() => {
    if (phase !== "pause" || !currentLine) return;

    const timer = setTimeout(() => {
      setPhase("clearing");
    }, currentLine.pause);
    return () => clearTimeout(timer);
  }, [phase, currentLine]);

  // Clearing → next line or done
  useEffect(() => {
    if (phase !== "clearing") return;

    const timer = setTimeout(() => {
      if (lineIndex < SEQUENCE.length - 1) {
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
        setDisplayText("");
        setPhase("typing");
      } else {
        setPhase("done");
      }
    }, CLEAR_SPEED);
    return () => clearTimeout(timer);
  }, [phase, lineIndex]);

  // Done → fade out then call onComplete
  useEffect(() => {
    if (phase !== "done") return;

    const timer = setTimeout(() => {
      onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  // Skip on click or key press
  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSkip]);

  return (
    <div
      className={`matrix-intro ${phase === "done" ? "matrix-intro-fadeout" : ""}`}
      onClick={handleSkip}
    >
      <div className="matrix-intro-terminal">
        <span className="matrix-intro-text">{displayText}</span>
        <span className="matrix-intro-caret">█</span>
      </div>
      <div className="matrix-intro-skip">
        press any key to skip
      </div>
    </div>
  );
}
