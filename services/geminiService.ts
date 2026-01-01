
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getTigerWisdom(balance: number, winStreak: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Fortune Tiger (Tigrinho). Be charismatic, encouraging, and slightly mystical. 
      The user current balance is R$${balance.toFixed(2)}. Their current win streak is ${winStreak}. 
      Give them a short, punchy (max 20 words) fortune or tip to keep them playing. Use Portuguese.`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 60,
      }
    });
    return response.text?.trim() || "O rugido da sorte te espera!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "A sorte está nos seus olhos, continue jogando!";
  }
}
