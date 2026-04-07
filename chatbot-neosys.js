/**
 * Neosys Aeon Chatbot - Implementation
 * Layer 1: Offline FAQ (Whitepaper 4.2)
 * Layer 2: AI Power (Gemini API)
 * UI: Glassmorphism Floating Button + Modal
 */

const NEOSYS_FAQ = {
    es: [
        {
            keywords: ['que es', 'neosys', 'aeon', 'definicion', 'concepto', 'marco', 'proyecto'],
            answer: 'Neosys Aeon es un marco conceptual abierto diseñado para mejorar cómo entendemos la realidad y tomamos decisiones basadas en evidencia. Fue fundado por Alberto Yépiz y busca integrar la epistemología, el método científico y la acción responsable.'
        },
        {
            keywords: ['principio', 'principios', '10', 'decálogo', 'reglas', 'normas', 'cosmos'],
            answer: 'Los 10 Principios del Cosmos son:\n1. Honrarás la verdad sobre la comodidad.\n2. Cultivarás la curiosidad.\n3. Recordarás que eres polvo de estrellas.\n4. Defenderás la evidencia.\n5. Practicarás la humildad cósmica.\n6. Cuidarás la Tierra.\n7. Amarás la vida.\n8. El misterio no es ignorancia.\n9. Transmitirás el conocimiento.\n10. Serás constructor, no solo observador.'
        },
        {
            keywords: ['fases', 'cadena', 'como funciona', 'etapas'],
            answer: 'Neosys Aeon opera en tres fases:\n1. **ENTENDER** (Epistemología): ¿Cómo conocemos?\n2. **VALIDAR** (Método científico): ¿Cómo verificamos?\n3. **APLICAR** (Ética aplicada): ¿Cómo actuamos?'
        },
        {
            keywords: ['religion', 'creencia', 'fe', 'secta', 'dogma'],
            answer: 'Neosys Aeon **NO** es una religión. No propone entidades sobrenaturales ni exige fe. Es un sistema abierto basado en la falsabilidad y la evidencia científica.'
        },
        {
            keywords: ['popper', 'kuhn', 'falsabilidad', 'ciencia', 'evidencia', 'metodo'],
            answer: 'El marco se basa en la lógica de Karl Popper (falsabilidad), Thomas Kuhn (estructuras del conocimiento) y el pensamiento crítico de Paul & Elder. Sostiene que el conocimiento debe ser revisable y no dogmático.'
        },
        {
            keywords: ['problema', 'diagnostico', 'desinformacion', 'pseudociencia'],
            answer: 'El diagnóstico es que el acceso masivo a datos no ha mejorado el pensamiento colectivo. Existe una desconexión entre la evidencia y la toma de decisiones, facilitando la propagación de pseudociencias.'
        },
        {
            keywords: ['organizacion', 'quien manda', 'jerarquia', 'lider'],
            answer: 'Neosys Aeon no es una organización ni una empresa. No tiene jerarquía ni jefes. Es un marco de adopción individual y voluntaria. Fue iniciado por Alberto Yépiz pero es de naturaleza abierta.'
        },
        {
            keywords: ['gratis', 'pagar', 'comprar', 'costo', 'producto'],
            answer: 'Neosys Aeon no es un producto comercial. No tiene fines de lucro ni barreras económicas. El whitepaper y el marco completo son de acceso libre.'
        },
        {
            keywords: ['hola', 'buenos dias', 'ayuda', 'saludos'],
            answer: '¡Hola! 🔭 Soy el asistente de Neosys Aeon. Puedo explicarte los principios del cosmos, el marco conceptual o detalles del Whitepaper v4.2. ¿Qué te gustaría saber?'
        }
    ],
    en: [
        {
            keywords: ['what is', 'neosys', 'aeon', 'definition', 'concept', 'framework', 'project'],
            answer: 'Neosys Aeon is an open conceptual framework designed to improve how we understand reality and make decisions based on evidence. Founded by Alberto Yépiz, it integrates epistemology, the scientific method, and responsible action.'
        },
        {
            keywords: ['principles', '10', 'rules', 'cosmos'],
            answer: 'The 10 Principles of the Cosmos are:\n1. Truth above comfort.\n2. Curiosity as virtue.\n3. Stardust belonging.\n4. Evidence as compass.\n5. Cosmic humility.\n6. Earth as home.\n7. Love life.\n8. Mystery is not ignorance.\n9. Transmit knowledge.\n10. Be a builder, not just an observer.'
        },
        {
            keywords: ['religion', 'belief', 'faith', 'cult', 'dogma'],
            answer: 'Neosys Aeon is **NOT** a religion. It does not propose supernatural entities or require faith. It is an open system based on falsifiability and scientific evidence.'
        }
    ],
    cn: [
        {
            keywords: ['什么是', 'neosys', 'aeon', '定义', '概念', '框架', '项目'],
            answer: 'Neosys Aeon 是一个开放的概念框架，旨在改善我们理解现实和基于证据做出决策的方式。由 Alberto Yépiz 创立，它整合了认识论、科学方法和负责任的行动。'
        },
        {
            keywords: ['原则', '10', '规则', '宇宙'],
            answer: '宇宙的 10 条原则是：\n1. 真实高于舒适。\n2. 好奇心是美德。\n3. 星尘的归属。\n4. 证据是指南针。\n5. 宇宙的谦逊。\n6. 地球是家。\n7. 热爱生命。\n8. 神秘不是无知。\n9. 传递知识。\n10. 成为建设者，而不仅仅是观察者。'
        }
    ]
};

const GEMINI_CONFIG = {
    // Keys are now fetched dynamically from Firebase Remote Config (GEMINI_KEY)
    systemPrompt: `You are the Neosys Aeon AI Assistant. 
    Your expertise is STRICTLY LIMITED to the Neosys Aeon framework...`
};

/** --- Logic Engine --- */

// Initialize Remote Config (Spark Plan compatible)
// Initialize Remote Config (Spark Plan compatible)
let remoteConfig;
function initRemoteConfig() {
    try {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            remoteConfig = firebase.remoteConfig();
            // Relax settings for development/immediate testing
            remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour for production balance
            remoteConfig.defaultConfig = { 'GEMINI_KEY': '' };
            console.log("[NEOSYS] Remote Config Module Ready.");
        } else {
            // Retry in 500ms if firebase isn't ready
            setTimeout(initRemoteConfig, 500);
        }
    } catch (e) {
        console.error("Remote Config Init Error:", e);
    }
}
initRemoteConfig();

function detectLanguage(text) {
    const spanishWords = ['que', 'como', 'donde', 'hola', 'principios', 'metodo', 'verdad'];
    const lowerText = text.toLowerCase();
    const spanishScore = spanishWords.filter(w => lowerText.includes(w)).length;
    return spanishScore > 0 ? 'es' : 'en';
}

function findOfflineAnswer(input, lang) {
    const text = input.toLowerCase();
    const faqs = NEOSYS_FAQ[lang] || NEOSYS_FAQ['es'];
    
    for (const item of faqs) {
        if (item.keywords.some(k => text.includes(k))) {
            return item.answer;
        }
    }
    return null;
}

async function getAIResponse(messages) {
    let apiKey = '';
    const currentPlatformLang = localStorage.getItem('neosys_lang') || 'en';

    // Fetch and activate the key from Remote Config
    try {
        if (remoteConfig) {
            await remoteConfig.fetchAndActivate();
            apiKey = remoteConfig.getValue('GEMINI_KEY').asString();
        }
    } catch (e) {
        console.warn("Could not fetch Remote Config:", e);
    }

    if (!apiKey) {
        console.error("CONFIG Error: GEMINI_KEY missing from Firebase Console (Remote Config).");
        return "⚠️ Configuration Error: GEMINI_KEY missing from Remote Config. Please ensure it is published in the Firebase Console."; 
    }

    const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    // Inject System Instruction with priority language
    if (contents.length > 0) {
        const langContext = `[IMPORTANT: Respond ALWAYS in ${currentPlatformLang.toUpperCase()} language level]`;
        contents[0].parts[0].text = `[SYSTEM INSTRUCTION: ${GEMINI_CONFIG.systemPrompt}]\n${langContext}\n\n` + contents[0].parts[0].text;
    }

    try {
        // Use v1 (Stable) instead of v1beta to ensure model availability
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        console.error('Gemini API Error:', e.message);
        return "System Error: Connection to AI core lost. Try again later.";
    }
}

/** --- UI Controller --- */

const chatbotUI = {
    messages: [],
    isOpen: false,

    init() {
        this.renderStructure();
        this.attachEvents();
    },

    renderStructure() {
        // Floating Button
        const btn = document.createElement('button');
        btn.id = 'neosysChatBtn';
        btn.className = 'neosys-chat-btn';
        btn.innerHTML = `<span class="btn-text">🤖 ¿? Dudas</span>`;
        document.body.appendChild(btn);

        // Overlay Modal
        const overlay = document.createElement('div');
        overlay.id = 'neosysChatOverlay';
        overlay.className = 'neosys-chat-overlay';
        overlay.innerHTML = `
            <div class="neosys-chat-modal">
                <div class="neosys-chat-header">
                    <div class="header-info">
                        <span class="header-icon">✨</span>
                        <div>
                            <h3>Neosys AI Assistant</h3>
                            <p>Offline FAQ + AI Insights</p>
                        </div>
                    </div>
                    <button id="neosysChatClose" class="close-btn">×</button>
                </div>
                <div id="neosysChatMessages" class="chat-messages"></div>
                <div class="chat-input-area">
                    <input type="text" id="neosysChatInput" placeholder="Pregunta sobre Neosys..." autocomplete="off">
                    <button id="neosysChatSend" class="send-btn">🚀</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Inject Base Styles
        const style = document.createElement('style');
        style.textContent = `
            .neosys-chat-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50px;
                padding: 12px 24px;
                color: white;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s ease;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            }
            .neosys-chat-btn:hover {
                transform: translateY(-5px);
                background: rgba(255, 255, 255, 0.2);
                box-shadow: 0 12px 40px rgba(167, 139, 250, 0.4);
            }
            .neosys-chat-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(5px);
                z-index: 10000;
                display: none;
                justify-content: center;
                align-items: center;
                padding: 20px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .neosys-chat-overlay.active {
                display: flex;
                opacity: 1;
            }
            .neosys-chat-modal {
                width: 100%;
                max-width: 480px;
                height: 600px;
                background: #0d0d0d;
                border-radius: 24px;
                border: 1px solid rgba(255,255,255,0.1);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.8);
            }
            .neosys-chat-header {
                padding: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255,255,255,0.03);
            }
            .header-info { display: flex; align-items: center; gap: 12px; }
            .header-info h3 { margin: 0; font-size: 16px; color: #a78bfa; }
            .header-info p { margin: 0; font-size: 11px; opacity: 0.6; color: white; }
            .close-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.5; }
            .close-btn:hover { opacity: 1; }
            .chat-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; }
            .msg { max-width: 85%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; color: white; position: relative; }
            .msg.bot { align-self: flex-start; background: rgba(255,255,255,0.05); border-bottom-left-radius: 4px; border: 1px solid rgba(255,255,255,0.05); }
            .msg.user { align-self: flex-end; background: linear-gradient(135deg, #6d28d9, #4c1d95); border-bottom-right-radius: 4px; }
            .msg.typing { font-style: italic; opacity: 0.7; padding: 8px 12px; }
            .chat-input-area { padding: 20px; display: flex; gap: 10px; border-top: 1px solid rgba(255,255,255,0.1); }
            .chat-input-area input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 25px; padding: 12px 20px; color: white; outline: none; transition: border-color 0.3s; }
            .chat-input-area input:focus { border-color: #a78bfa; }
            .send-btn { background: #a78bfa; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; transition: transform 0.2s; }
            .send-btn:hover { transform: scale(1.1); }
            @media (max-width: 600px) {
                .neosys-chat-btn { bottom: 20px; right: 20px; font-size: 13px; }
                .neosys-chat-modal { height: 80vh; }
            }
        `;
        document.head.appendChild(style);
    },

    attachEvents() {
        const btn = document.getElementById('neosysChatBtn');
        const overlay = document.getElementById('neosysChatOverlay');
        const close = document.getElementById('neosysChatClose');
        const input = document.getElementById('neosysChatInput');
        const send = document.getElementById('neosysChatSend');

        btn.addEventListener('click', () => this.toggle(true));
        close.addEventListener('click', () => this.toggle(false));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) this.toggle(false); });
        
        send.addEventListener('click', () => this.handleSendMessage());
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.handleSendMessage(); });

        // Listen for platform language changes
        window.addEventListener('neosys:langChange', (e) => {
            this.updateButtonText(e.detail.lang);
        });
        this.updateButtonText(localStorage.getItem('neosys_lang') || 'en');
    },

    updateButtonText(lang) {
        const btn = document.getElementById('neosysChatBtn');
        if (!btn) return;
        const textSpan = btn.querySelector('.btn-text');
        if (lang === 'es') textSpan.textContent = '🤖 ¿? Charla Aquí';
        else if (lang === 'cn') textSpan.textContent = '🤖 ¿? 在这里聊聊';
        else textSpan.textContent = '🤖 ¿? Talk Here';
    },

    toggle(open) {
        const overlay = document.getElementById('neosysChatOverlay');
        const lang = localStorage.getItem('neosys_lang') || 'en';
        if (open) {
            overlay.classList.add('active');
            if (this.messages.length === 0) {
                const greetings = {
                    es: '¡Hola! 👋 Soy el asistente de Neosys Aeon. ¿En qué puedo ayudarte hoy?',
                    en: 'Hello! 👋 I am the Neosys Aeon assistant. How can I help you today?',
                    cn: '你好！👋 我是 Neosys Aeon 助手。今天我能帮你什么？'
                };
                this.addMessage(greetings[lang] || greetings.en, 'bot');
            }
        } else {
            overlay.classList.remove('active');
        }
        this.isOpen = open;
    },

    addMessage(text, side) {
        this.messages.push({ text, side });
        const container = document.getElementById('neosysChatMessages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${side}`;
        msgDiv.innerHTML = text;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    async handleSendMessage() {
        const input = document.getElementById('neosysChatInput');
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';

        // Typing indicator
        const container = document.getElementById('neosysChatMessages');
        const typing = document.createElement('div');
        typing.className = 'msg bot typing';
        typing.textContent = '...';
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;

        const lang = detectLanguage(text);

        // Layer 1: Offline FAQ
        const offlineAnswer = findOfflineAnswer(text, lang);
        
        setTimeout(async () => {
            typing.remove();
            if (offlineAnswer) {
                this.addMessage(offlineAnswer, 'bot');
            } else {
                // Layer 2: AI Power
                const history = this.messages.map(m => ({
                    role: m.side === 'user' ? 'user' : 'assistant',
                    content: m.text
                }));
                const aiAnswer = await getAIResponse(history);
                this.addMessage(aiAnswer || 'No puedo conectar con mi núcleo central ahora. (Fallo de IA)', 'bot');
            }
        }, 800);
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    chatbotUI.init();
});
