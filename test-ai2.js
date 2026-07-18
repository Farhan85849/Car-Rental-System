import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: 'Hello',
    });
    console.log("SUCCESS:", result.text);
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}
test();
