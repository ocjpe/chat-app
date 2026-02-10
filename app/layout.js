import "./globals.css";
import "../frontend/styles/sidebar.css";
import "../frontend/styles/chat.css";
import "../frontend/styles/login.css";
import "../frontend/styles/profile.css";

export const metadata = {
  title: "Chat IA",
  description: "Application de chat avec intelligence artificielle",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
