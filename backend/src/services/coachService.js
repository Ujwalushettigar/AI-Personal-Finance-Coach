const { GoogleGenerativeAI } = require('@google/generative-ai');

async function askCoach(userMessage, userContext = {}) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set.');
      return "Gemini API key is not configured. Please add your GEMINI_API_KEY in backend/.env and restart the server.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a personal finance coach. Answer the user's question using ONLY the financial data provided below. Be concise, practical, and specific with numbers when available. If data is missing, say so rather than guessing.

Financial Data:
${JSON.stringify(userContext, null, 2)}

User Question: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "I'm having trouble answering right now, please try again.";
  } catch (error) {
    console.error('Error calling Gemini API in coachService:', error);
    return "I'm having trouble answering right now, please try again.";
  }
}

module.exports = {
  askCoach,
};
