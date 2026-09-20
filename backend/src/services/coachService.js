const { Mistral } = require('@mistralai/mistralai');

function buildPrompt(userMessage, userContext) {
  return `You are FinPilot's concise personal finance coach.

User financial context:
${JSON.stringify(userContext)}

Rules:
- Answer in 2-5 short sentences or at most 3 bullets.
- Give one clear action the user can take next.
- Use the supplied numbers when relevant; do not invent account data.
- If data is missing, state the assumption briefly and give general guidance.
- No greetings, long explanations, disclaimers, or repeated context.

Question: ${userMessage}`;
}

async function askGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 512,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Gemini API ${response.status}: ${data?.error?.message || 'request failed'}`);
  }

  return data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim() || null;
}

async function askCoach(userMessage, userContext = {}) {
  const prompt = buildPrompt(userMessage, userContext);

  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (apiKey) {
      const client = new Mistral({ apiKey });
      const chatResponse = await client.chat.complete({
        model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.25,
        maxTokens: 220,
        topP: 0.8,
      });

      const reply = chatResponse.choices?.[0]?.message?.content;
      if (reply) return reply;
    }
  } catch (error) {
    console.error('Error calling Mistral API in coachService:', error.message || error);
  }

  try {
    const fallbackReply = await askGemini(prompt);
    if (fallbackReply) return fallbackReply;
  } catch (error) {
    console.error('Error calling Gemini fallback in coachService:', error.message || error);
  }

  return 'The AI coach is temporarily unavailable. Please try again in a moment.';
}

module.exports = {
  askCoach,
};
