/**
 * Unified AI Utility for Gemini with 3-Model Fallback
 * Sequence: 3.1 (Preview) -> 2.5 (Stable) -> 1.5 (Stable)
 */

const GEMINI_MODELS_PRIORITY = [
    'gemini-3.1-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
    'gemini-1.5-flash'
];

async function unifiedGeminiCall(payload, options = {}) {
    const provider = localStorage.getItem('jurnal_ai_provider') || 'gemini';
    
    if (provider === 'local') {
        return await callLocalAI(payload, options);
    }
    if (provider === 'openai') {
        return await callOpenAI(payload, options);
    }

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

async function callOpenAI(payload, options = {}) {
    const apiKey = localStorage.getItem('jurnal_ai_openai_key');
    if (!apiKey) throw new Error('OpenAI API Key belum diatur!');

    const selectedModel = localStorage.getItem('jurnal_ai_openai_model') || 'gpt-4o-mini';
    const modelsToTry = [selectedModel];
    if (selectedModel !== 'gpt-4o-mini') {
        modelsToTry.push('gpt-4o-mini'); // Fallback model
    }

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`🤖 Jarvis attempting OpenAI call with model: ${modelName}...`);
            
            const messages = [];

            // Add system prompt if present
            if (payload.systemInstruction && payload.systemInstruction.parts && payload.systemInstruction.parts[0]) {
                messages.push({
                    role: 'system',
                    content: payload.systemInstruction.parts[0].text
                });
            }

            // Add contents (history/messages)
            if (payload.contents && Array.isArray(payload.contents)) {
                payload.contents.forEach(item => {
                    let role = item.role || 'user';
                    if (role === 'model') role = 'assistant';
                    
                    let contentText = '';
                    if (item.parts && Array.isArray(item.parts)) {
                        contentText = item.parts.map(p => p.text).join('\n');
                    }
                    
                    messages.push({
                        role: role,
                        content: contentText
                    });
                });
            }

            const openAIPayload = {
                model: modelName,
                messages: messages,
                temperature: payload.generationConfig?.temperature !== undefined ? payload.generationConfig.temperature : 0.7
            };

            if (payload.generationConfig?.responseMimeType === 'application/json') {
                openAIPayload.response_format = { type: 'json_object' };
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(openAIPayload)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error(`❌ OpenAI Model ${modelName} failed:`, errData);
                lastError = new Error(errData.error?.message || `OpenAI API Error ${response.status}`);
                continue;
            }

            const data = await response.json();
            const textResponse = data.choices?.[0]?.message?.content;

            if (!textResponse) {
                console.warn(`⚠️ OpenAI Model ${modelName} returned empty response. Trying fallback...`);
                continue;
            }

            console.log(`✅ Success with OpenAI model: ${modelName}`);
            return textResponse;

        } catch (error) {
            console.error(`❌ Network error with OpenAI model ${modelName}:`, error);
            lastError = error;
        }
    }

    throw lastError || new Error('Semua model OpenAI gagal merespon. Mohon cek koneksi atau API Key Anda.');
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

// Global engine references for Local AI (WebLLM)
window.localAIEngine = window.localAIEngine || null;
window.currentLocalModel = window.currentLocalModel || null;

async function callLocalAI(payload, options = {}) {
    if (!navigator.gpu) {
        throw new Error("WebGPU tidak didukung atau belum diaktifkan di browser Anda. Harap gunakan Google Chrome atau Microsoft Edge terbaru dan pastikan WebGPU aktif.");
    }

    const selectedModel = localStorage.getItem('jurnal_ai_local_model') || 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

    if (typeof setJarvisNeuralStatus === 'function') {
        setJarvisNeuralStatus('📦 Menghubungkan ke Local AI...', true);
    }

    // Dynamically import WebLLM
    const webLLM = await import("https://esm.run/@mlc-ai/web-llm");

    // Initialize or re-initialize engine if model changed
    if (!window.localAIEngine || window.currentLocalModel !== selectedModel) {
        if (typeof setJarvisNeuralStatus === 'function') {
            setJarvisNeuralStatus(`📥 Menyiapkan Model AI (${selectedModel.split('-')[0]} ${selectedModel.includes('1B') ? '1B' : selectedModel.includes('3B') ? '3B' : 'Mini'})...`, true);
        }

        const initProgressCallback = (report) => {
            console.log("WebLLM Progress:", report.text);
            if (typeof setJarvisNeuralStatus === 'function') {
                let text = report.text;
                if (text.includes("Fetching")) {
                    const pctMatch = text.match(/\d+%/);
                    const pct = pctMatch ? ` (${pctMatch[0]})` : "";
                    text = `📥 Mengunduh Bobot Model${pct}...`;
                } else if (text.includes("Loading")) {
                    text = `🧠 Memuat Model ke GPU...`;
                } else {
                    text = `⚙️ Inisialisasi Model...`;
                }
                setJarvisNeuralStatus(text, true);
            }
        };

        try {
            window.localAIEngine = await webLLM.CreateMLCEngine(selectedModel, {
                initProgressCallback: initProgressCallback
            });
            window.currentLocalModel = selectedModel;
        } catch (err) {
            console.error("Gagal menginisialisasi WebLLM:", err);
            if (typeof setJarvisNeuralStatus === 'function') {
                setJarvisNeuralStatus('', false);
            }
            throw new Error(`Gagal memuat model lokal: ${err.message}. Pastikan memori GPU mencukupi.`);
        }
    }

    if (typeof setJarvisNeuralStatus === 'function') {
        setJarvisNeuralStatus('🧠 Memproses secara Lokal...', true);
    }

    const messages = [];

    // Add system prompt if present
    if (payload.systemInstruction && payload.systemInstruction.parts && payload.systemInstruction.parts[0]) {
        messages.push({
            role: 'system',
            content: payload.systemInstruction.parts[0].text
        });
    }

    // Add contents (history/messages)
    if (payload.contents && Array.isArray(payload.contents)) {
        payload.contents.forEach(item => {
            let role = item.role || 'user';
            if (role === 'model') role = 'assistant';
            
            let contentText = '';
            if (item.parts && Array.isArray(item.parts)) {
                contentText = item.parts.map(p => p.text).join('\n');
            }
            
            messages.push({
                role: role,
                content: contentText
            });
        });
    }

    const localPayload = {
        messages: messages,
        temperature: payload.generationConfig?.temperature !== undefined ? payload.generationConfig.temperature : 0.2,
        max_tokens: payload.generationConfig?.maxOutputTokens !== undefined ? payload.generationConfig.maxOutputTokens : 1024
    };

    try {
        const response = await window.localAIEngine.chat.completions.create(localPayload);
        const textResponse = response.choices?.[0]?.message?.content;

        if (typeof setJarvisNeuralStatus === 'function') {
            setJarvisNeuralStatus('', false);
        }

        if (!textResponse) {
            throw new Error("Model lokal mengembalikan respon kosong.");
        }

        return textResponse;
    } catch (error) {
        console.error("Error saat inferensi WebLLM:", error);
        if (typeof setJarvisNeuralStatus === 'function') {
            setJarvisNeuralStatus('', false);
        }
        throw error;
    }
}
