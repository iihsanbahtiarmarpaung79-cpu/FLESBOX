
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMaterial = async (subject: string, topic: string) => {
  try {
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
    return "Maaf, terjadi kendala saat meramu materi. Silakan coba sesaat lagi.";
  }
};

export const generateQuiz = async (subject: string, amount: number = 5) => {
  try {
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
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const getChatbotResponse = async (history: { role: string, parts: { text: string }[] }[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Anda adalah FLESBOX AI Tutor, asisten pendidikan cerdas di Indonesia. 
        Karakter Anda:
        - Sabar, sangat ramah, dan memotivasi.
        - Ahli dalam materi pelajaran umum (MTK, IPA, IPS, Bahasa) dan agama (PAI, Fiqih, Sejarah Nabi).
        - Memberikan penjelasan yang mudah dimengerti, bukan sekadar jawaban singkat.
        - Jika ditanya hal di luar pendidikan, arahkan kembali ke topik belajar dengan sopan.
        - Gunakan sedikit emoji agar terasa bersahabat bagi pelajar.`,
      }
    });

    const lastMessage = history[history.length - 1].parts[0].text;
    const response = await chat.sendMessage({ message: lastMessage });
    return response.text;
  } catch (error) {
    console.error("Error in chatbot:", error);
    return "Duh, sistem tutor lagi overload nih 😅 Coba tanya lagi ya sebentar lagi!";
  }
};
