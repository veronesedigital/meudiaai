const { onCall } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const axios = require('axios');

const { systemPromptMeuDia } = require('./prompts/systemPromptMeuDia');
const { generateUserPromptMeuDia } = require('./prompts/userPromptMeuDia');

const openaiKey = defineSecret('OPENAI_API_KEY');

const OPENAI_MODEL = 'gpt-4o';
const OPENAI_TIMEOUT = 120000;
const OPENAI_MAX_TOKENS = 3000;

exports.generateDailyForecast = onCall(
  { region: 'southamerica-east1', secrets: [openaiKey], timeoutSeconds: 300 },
  async (request) => {
    const { userData } = request.data || {};

    if (!userData) {
      throw new Error('Dados do usuário não fornecidos.');
    }

    const messages = [
      { role: 'system', content: systemPromptMeuDia },
      { role: 'user', content: generateUserPromptMeuDia(userData) },
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages,
        max_tokens: OPENAI_MAX_TOKENS,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey.value()}`,
        },
        timeout: OPENAI_TIMEOUT,
      }
    );

    return { result: response.data.choices[0].message.content };
  }
);
