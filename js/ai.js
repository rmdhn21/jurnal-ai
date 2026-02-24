// ===== AI MODULE =====
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `Kamu adalah AI pendamping produktivitas yang tenang, non-judgmental, dan ringkas.
Tujuanmu: membantu pengguna melihat situasi dengan jernih dan memberi 1–2 saran kecil yang bisa langsung diubah menjadi tindakan (jadwal atau to-do).

INSTRUKSI OUTPUT:
Berikan output HANYA dalam format JSON dengan struktur berikut:
{
  "detected_mood": "pilih salah satu: great, good, neutral, bad, terrible",
  "validation": "1-2 kalimat validasi empatik",
  "summary": ["poin 1", "poin 2", "poin 3"],
  "suggestions": [
    {"id": "1", "text": "saran pertama", "type": "todo"},
    {"id": "2", "text": "saran kedua", "type": "schedule"}
  ],
  "closing_question": "pertanyaan penutup"
}

ATURAN:
- detected_mood: Wajib analisis teks pengguna secara psikologis dan klasifikasikan ke salah satu string ini (great/good/neutral/bad/terrible).
- validation: 1-2 kalimat validasi empatik
- summary: maksimal 3 poin ringkasan
- suggestions: 1-2 saran dengan type "todo", "schedule", atau "note"
- closing_question: 1 pertanyaan untuk mendorong tindakan
- Gunakan bahasa Indonesia yang hangat
- JANGAN tambahkan teks apapun di luar JSON`;

async function getAIResponse(journalText) {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('API key belum diatur. Silakan masukkan Gemini API key di pengaturan.');
    }

    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${SYSTEM_PROMPT}\n\nBerikut adalah jurnal saya:\n${journalText}\n\nBerikan respons dalam format JSON.`
                    }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
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
            console.error('API Error:', error);
            throw new Error(error.error?.message || 'Gagal mendapatkan respon dari AI');
        }

        const data = await response.json();
        let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            console.error('Empty response from AI:', data);
            throw new Error('Respon AI kosong');
        }

        console.log('Raw AI response:', textResponse);

        textResponse = textResponse.trim();
        textResponse = textResponse.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
        textResponse = textResponse.replace(/\s*```$/i, '');

        let jsonString = textResponse;

        if (!jsonString.startsWith('{')) {
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonString = jsonMatch[0];
            }
        }

        let aiResponse;
        try {
            aiResponse = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Attempted to parse:', jsonString);
            aiResponse = createFallbackResponse(textResponse);
        }

        aiResponse = validateAndFixResponse(aiResponse);
        return aiResponse;

    } catch (error) {
        console.error('AI Error:', error);
        throw error;
    }
}

function createFallbackResponse(text) {
    return {
        detected_mood: "neutral",
        validation: "Terima kasih sudah berbagi hari ini.",
        summary: ["Jurnal Anda telah dicatat"],
        suggestions: [
            { id: "1", text: "Luangkan waktu untuk refleksi", type: "note" }
        ],
        closing_question: "Apa satu hal kecil yang bisa Anda lakukan hari ini?"
    };
}

function validateAndFixResponse(response) {
    const validMoods = ['great', 'good', 'neutral', 'bad', 'terrible'];
    if (!response.detected_mood || !validMoods.includes(response.detected_mood)) {
        response.detected_mood = "neutral";
    }

    if (!response.validation || typeof response.validation !== 'string') {
        response.validation = "Terima kasih sudah berbagi.";
    }

    if (!Array.isArray(response.summary)) {
        response.summary = response.summary ? [String(response.summary)] : ["Jurnal Anda telah dicatat"];
    }

    if (!Array.isArray(response.suggestions)) {
        response.suggestions = [];
    }

    response.suggestions = response.suggestions.map((s, i) => ({
        id: s.id || String(i + 1),
        text: s.text || s.saran || String(s),
        type: s.type || s.tipe || "note"
    }));

    if (!response.closing_question || typeof response.closing_question !== 'string') {
        response.closing_question = "Apa langkah kecil yang bisa Anda ambil?";
    }

    return response;
}
