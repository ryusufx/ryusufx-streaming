
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function translateSynopsis(text: string, title: string): Promise<string> {
  if (!text || text.length < 5) return "Sinopsis belum tersedia untuk judul ini.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Terjemahkan atau buat sinopsis film/series "${title}" ini ke Bahasa Indonesia yang menarik dan profesional: "${text}"`,
      config: {
        systemInstruction: "Anda adalah penulis sinopsis film profesional dalam Bahasa Indonesia.",
        temperature: 0.7,
      },
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini translation error:", error);
    return text; // Fallback to original
  }
}
