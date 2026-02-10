import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Envoie un message à l'API Groq et retourne la réponse de l'IA.
 * @param {Array} messages - L'historique des messages au format { role, content }.
 * @returns {Promise<string>} La réponse de l'IA.
 */
export async function getAIResponse(messages) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Tu es un assistant virtuel amical et utile. Tu réponds en français de manière claire et concise.",
      },
      ...messages,
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
  });

  return chatCompletion.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer de réponse.";
}
