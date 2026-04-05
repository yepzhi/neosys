/**
 * Neosys Aeon - Gemini AI Proxy
 * Securely calls Gemini 1.5 Flash using Cloud Secret Manager.
 * No API Keys are exposed on the client side.
 */

const { onRequest } = require("firebase-functions/v2/https");
const axios = require("axios");
const logger = require("firebase-functions/logger");

// Main handler for AI requests
exports.askNeosys = onRequest(
    { 
        secrets: ["GEMINI_API_KEY"], // Secret stored in GCP Secret Manager
        cors: true                   // Allows requests from your yepzhi.com domain
    }, 
    async (req, res) => {
        try {
            const { contents } = req.body;
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                logger.error("[SECURE PROXY] Gemini API Key is missing from secrets.");
                return res.status(500).json({ error: "Configuration Error: Key missing." });
            }

            // Using GEMINI 1.5 FLASH (The most cost-effective and fastest model)
            // Endpoint: v1beta for better model compatibility
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

            const response = await axios.post(url, { contents }, {
                headers: { 'Content-Type': 'application/json' }
            });

            // Return the full candidate response (handled by chatbot-neosys.js)
            res.status(200).json(response.data);

        } catch (error) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            logger.error("[SECURE PROXY] AI Engine Error:", errorMsg);
            
            res.status(error.response?.status || 500).json({ 
                error: "AI Engine fail", 
                details: errorMsg 
            });
        }
    }
);
