
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Creates a fresh instance of the Gemini API client.
 * This ensures we always use the latest API key from process.env.API_KEY,
 * which is managed by the Netlify environment variables in production.
 */
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY environment variable is not defined.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateMaterial = async (subject: string, topic: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bertindaklah sebagai guru ahli dari Indonesia. Buatkan materi pembelajaran yang sangat mendalam dan edukatif untuk mata pelajaran "${subject}" dengan fokus pada: "${topic}". 
      Struktur materi:
      1. Pendahuluan & Definisi
      2. Poin-poin Utama (bullet points)
      3. Penjelasan Mendalam
      4. Contoh Kasus/Soal
      5. Kesimpulan Cepat (Key Takeaways)
      
      Gunakan bahasa yang ramah siswa, jelas, dan memotivasi. Format dengan Markdown yang rapi.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating material:", error);
    return "Maaf, terjadi kendala saat meramu materi. Pastikan API Key sudah dikonfigurasi di Netlify.";
  }
};

export const generateQuiz = async (subject: string, amount: number = 5) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatkan kuis pilihan ganda edukatif sebanyak ${amount} soal untuk mata pelajaran ${subject}. Soal harus menantang namun sesuai kurikulum SD/SMP/SMA. Pastikan ada 4 pilihan jawaban (A, B, C, D) dan hanya satu jawaban benar yang logis.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                minItems: 4,
                maxItems: 4
              },
              correctAnswer: { type: Type.INTEGER, description: "Indeks 0-3 dari pilihan yang benar" }
            },
            required: ["id", "question", "options", "correctAnswer"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const getChatbotResponse = async (
  history: { role: string, parts: any[] }[], 
  currentParts?: any[]
) => {
  try {
    const ai = getAIClient();
    // Using gemini-3-pro-preview for higher quality educational dialogue
    // If currentParts is provided (new message with potential images), we use generateContent directly for simplicity in stateless context
    // or we can append to chat. But to handle images robustly with history in this simple setup,
    // we will rely on generateContent if images are involved, or chat if text only.
    // However, ai.chats.create works best. Let's send the prompt.
    
    // Note: Standard chat.sendMessage only accepts 'message' (string | Part[]).
    // If we have history, we should initialize chat with it.
    
    // Filter history to ensure it complies with API expectations (text only for history in this simple impl to avoid complex image reconstruction)
    // or pass simple text history.
    const textHistory = history.map(h => ({
        role: h.role,
        parts: h.parts.filter(p => p.text).map(p => ({ text: p.text }))
    })).filter(h => h.parts.length > 0);

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: textHistory,
      config: {
        systemInstruction: `Anda adalah FLESBOX AI Tutor, asisten pendidikan cerdas di Indonesia. 
        Karakter Anda:
        - Sabar, sangat ramah, dan memotivasi.
        - Ahli dalam materi pelajaran umum (MTK, IPA, IPS, Bahasa) dan agama (PAI, Fiqih, Sejarah Nabi).
        - Memberikan penjelasan yang mudah dimengerti, bukan sekadar jawaban singkat.
        - Jika siswa mengirim gambar soal, analisis gambar tersebut dan bantu jawab.
        - Gunakan sedikit emoji agar terasa bersahabat bagi pelajar. 🎓`,
      }
    });

    let messageToSend: any;
    if (currentParts && currentParts.length > 0) {
        messageToSend = currentParts;
    } else {
        // Fallback or error
        return "Silakan tulis pertanyaanmu.";
    }

    const response = await chat.sendMessage({ message: messageToSend });
    return response.text;
  } catch (error) {
    console.error("Error in chatbot:", error);
    return "Duh, tutor sedang sibuk nih 😅 Pastikan API Key di Netlify sudah benar ya!";
  }
};
