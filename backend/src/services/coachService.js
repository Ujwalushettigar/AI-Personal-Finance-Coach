const { Mistral } = require('@mistralai/mistralai');

async function askCoach(userMessage, userContext = {}) {
  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      console.warn('MISTRAL_API_KEY environment variable is not set.');
      return "Mistral API key is not configured. Please add your MISTRAL_API_KEY in backend/.env and restart the server.";
    }

    const client = new Mistral({ apiKey });

    const prompt = `You are FinPilot's concise personal finance coach.

User financial context:
${JSON.stringify(userContext)}

Rules:
- Answer in 2-5 short sentences or at most 3 bullets.
- Give one clear action the user can take next.
- Use the supplied numbers when relevant; do not invent account data.
- If data is missing, state the assumption briefly and give general guidance.
- No greetings, long explanations, disclaimers, or repeated context.

Question: ${userMessage}`;

    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.25,
      maxTokens: 220,
      topP: 0.8,
    });

    return chatResponse.choices[0].message.content || "I'm having trouble answering right now, please try again.";
  } catch (error) {
    console.error('Error calling Mistral API in coachService:', error);
    return "I'm having trouble answering right now, please try again.";
  }
}

module.exports = {
  askCoach,
};
