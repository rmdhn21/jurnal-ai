// AI module - handles Gemini Pro API integration
import { getApiKey } from './storage.js';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `Kamu adalah AI pendamping produktivitas yang tenang, non-judgmental, dan ringkas.
Tujuanmu: membantu pengguna melihat situasi dengan jernih dan memberi 1–2 saran kecil yang bisa langsung diubah menjadi tindakan (jadwal atau to-do).
Aturan:
1) Mulai dengan 1-2 kalimat validasi empatik.
2) Berikan ringkasan singkat (3 poin max) dari jurnal.
3) Berikan 1–2 saran praktis, realistis, dan spesifik untuk "besok" atau tindakan segera; setiap saran harus ditandai dengan tipe: "todo", "schedule", atau "note".
4) Tutup dengan 1 pertanyaan pilihan untuk mendorong tindakan.
5) Tidak memberi nasihat medis/psikologis atau memojokkan.
6) Outputkan jawaban HANYA dalam format JSON valid dengan field: validation (string), summary (array of strings), suggestions (array of objects dengan id, text, type), closing_question (string).
7) JANGAN tambahkan teks apapun di luar JSON. Response harus dimulai dengan { dan diakhiri dengan }.
Gunakan bahasa Indonesia yang hangat dan tenang.`;

export async function getAIResponse(journalText) {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('API key belum diatur. Silakan masukkan Gemini API key di pengaturan.');
    }

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: `${SYSTEM_PROMPT}\n\nBerikut adalah jurnal saya:\n${journalText}`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    };

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gagal mendapatkan respon dari AI');
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            throw new Error('Respon AI kosong');
        }

        // Parse JSON from response
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Format respon AI tidak valid');
        }

        const aiResponse = JSON.parse(jsonMatch[0]);

        // Validate response structure
        if (!aiResponse.validation || !aiResponse.summary || !aiResponse.suggestions) {
            throw new Error('Struktur respon AI tidak lengkap');
        }

        return aiResponse;

    } catch (error) {
        console.error('AI Error:', error);
        throw error;
    }
}

// Mock response for testing without API key
export function getMockResponse(journalText) {
    return {
        validation: "Kedengarannya hari ini cukup melelahkan dan banyak yang mengganggu pikiranmu.",
        summary: [
            "Ada beberapa hal yang sedang kamu pikirkan",
            "Sepertinya ada perasaan lelah atau overwhelmed",
            "Kamu sedang mencari cara untuk mengatasinya"
        ],
        suggestions: [
            {
                id: "s1",
                text: "Jadwalkan 30 menit besok pagi untuk menyelesaikan hal terpenting",
                type: "schedule"
            },
            {
                id: "s2",
                text: "Buat daftar 3 prioritas utama untuk minggu ini",
                type: "todo"
            }
        ],
        closing_question: "Mau saya tambahkan salah satu ke jadwal atau to-do sekarang?"
    };
}
