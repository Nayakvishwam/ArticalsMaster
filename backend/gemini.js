// services/gemini.js
const axios = require('axios');
require('dotenv').config();

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function askGemini(promptText) {
  const payload = {
    contents: [
      {
        parts: [
          {
            text: promptText,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(GEMINI_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { askGemini };
