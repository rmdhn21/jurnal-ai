/**
 * Unified AI Utility for Gemini with 3-Model Fallback
 * Sequence: 3.1 (Preview) -> 2.5 (Stable) -> 1.5 (Stable)
 */

const GEMINI_MODELS_PRIORITY = [
    'gemini-3.1-flash-lite-preview',
    'gemini-2.5-flash',
    'gemini-1.5-flash'
];

async function unifiedGeminiCall(payload, options = {}) {
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : localStorage.getItem('jurnal_ai_gemini_key');
    if (!apiKey) throw new Error('API Key belum diatur!');

    let lastError = null;

    // Try each model in the priority list
    for (const modelName of GEMINI_MODELS_PRIORITY) {
        try {
            console.log(`🤖 Jarvis attempting AI call with model: ${modelName}...`);
            
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 429) {
                console.warn(`⚠️ Model ${modelName} rate limited (429). Trying next fallback...`);
                continue;
            }

            if (response.status >= 500) {
                console.warn(`⚠️ Model ${modelName} server error (${response.status}). Trying next fallback...`);
                continue;
            }

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error(`❌ Model ${modelName} failed:`, errData);
                lastError = new Error(errData.error?.message || `API Error ${response.status}`);
                continue; // Try next model for other errors too (like invalid model name in some regions)
            }

            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!textResponse) {
                console.warn(`⚠️ Model ${modelName} returned empty response. Trying next fallback...`);
                continue;
            }

            console.log(`✅ Success with model: ${modelName}`);
            return textResponse;

        } catch (error) {
            console.error(`❌ Network error with model ${modelName}:`, error);
            lastError = error;
            // Continue to fallback
        }
    }

    throw lastError || new Error('Semua model AI gagal merespon. Mohon cek koneksi atau API Key Anda.');
}

/**
 * Convenience wrapper for simple prompt-based calls
 */
async function getQuickAIResponse(prompt, systemPrompt = null) {
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    if (systemPrompt) {
        payload.systemInstruction = {
            parts: [{ text: systemPrompt }]
        };
    }

    return await unifiedGeminiCall(payload);
}
