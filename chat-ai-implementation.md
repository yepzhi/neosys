# 🔭 Chat AI Implementation - Neosys Aeon

Architecture and implementation guide for the multi-layer AI Chatbot, designed for high-performance offline responses and context-aware AI fallback.

---

## 🏗️ Architecture Overview

The system operates on a **Hybrid Retrieval Model**:

1. **Layer 1: Offline FAQ (Knowledge Reservoir)**
   - **Mechanism**: Local keyword matching and fuzzy substring search.
   - **Knowledge Source**: Synthesized content from the Neosys Whitepaper v4.2.
   - **Benefit**: Zero latency, zero API cost, 100% accurate to the source material.

2. **Layer 2: AI Layer (Dynamic Reasoning)**
   - **Mechanism**: Google Gemini 1.5/2.0 API calls.
   - **Thematic Guardrails**: A strict "System Instruction" that limits the AI to only discuss Neosys Aeon and the 10 Principles of the Cosmos.
   - **Benefit**: Handles complex phrasing, edge cases, and provides "human-like" reasoning for philosophical queries.

---

## 🛠️ Implementation Details

### 1. Script Location
- **Core Logic**: `chatbot-neosys.js`
- **UI Integration**: Injected into `index.html` as a `<script defer>` tag.

### 2. Knowledge Synthesis (Offline)
The offline layer contains specific dictionaries for Spanish and English. If a user's query contains keywords like "principios", "popper", or "religion", the bot responds immediately with pre-validated answers from the whitepaper.

### 3. AI Guardrails (Thematic Restriction)
To keep the bot focused on Neosys, the following prompt is injected:
> "Your expertise is STRICTLY LIMITED to the Neosys Aeon framework... If the user asks about ANYTHING outside Neosys Aeon (cooking, general science, math...), you MUST politely refuse."

### 4. UI/UX Aesthetics (Glassmorphism)
- **Floating Button**: Sticky pill button with `backdrop-filter: blur(15px)`.
- **Chat Modal**: Dark aesthetic with CSS gradients and smooth slide-up animations.
- **Mobile Responsive**: Uses `clamp()` and media queries to ensure usability on small screens.

---

## ⚠️ Security & Portability

- **API Key**: Currently implemented using a direct client-side call for speed to demonstrate "The Power of AI". 
- **Porting to Other Sites**: 
  1. Copy `chatbot-neosys.js`.
  2. Update the `NEOSYS_FAQ` object with the new site's specific knowledge base.
  3. Ensure the CSS names do not collide with the existing site's styles.

---

## ✅ Deployment Checklist
- [x] Verify API Key connectivity.
- [x] Check keyword dictionary for both languages.
- [x] Ensure button visibility on mobile.
- [x] Test off-topic refusal (e.g. "tell me a joke" vs "explain Principle IV").

*Built with #NeosysAeon Principles in mind: Focus, Evidence, and Clarity.*
