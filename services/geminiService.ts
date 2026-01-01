
import { GoogleGenAI } from "@google/genai";

export async function getTigerWisdom(balance: number, consecutiveLosses: number): Promise<string> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "A sorte é um rugido silencioso que espera sua persistência!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Fortune Tiger (Tigrinho), a mystical guardian of luck.
      User context: Balance R$${balance.toFixed(2)}, Consecutive losses: ${consecutiveLosses}.
      Task: Give a very short (max 15 words), charismatic, and encouraging fortune message in PORTUGUESE.
      Be slightly mysterious but very engaging.`,
      config: {
        temperature: 0.9,
        maxOutputTokens: 50,
      }
    });

    return response.text?.trim() || "O rugido da sorte te chama para a vitória!";
  } catch (error) {
    console.warn("Gemini Service Unavailable, using fallback.");
    return "O destino favorece os corajosos. Continue girando!";
  }
}
