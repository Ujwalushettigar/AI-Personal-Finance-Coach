let GoogleGenerativeAI;
try {
  ({ GoogleGenerativeAI } = require('@google/generative-ai'));
} catch (err) {
  GoogleGenerativeAI = null;
}

async function askCoach(userMessage, userContext = {}) {
  try {
    if (!GoogleGenerativeAI) {
      console.warn('@google/generative-ai is not installed in backend/node_modules.');
      return "The AI Coach module (@google/generative-ai) is not installed. Please run 'npm install' in the backend directory.";
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set.');
      return "Gemini API key is not configured. Please add your GEMINI_API_KEY in backend/.env and restart the server.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are FinPilot's AI Financial Coach. Your mission is to provide clear, friendly, practical, and highly helpful financial guidance to the user.

Financial Context Provided:
${Object.keys(userContext).length > 0 ? JSON.stringify(userContext, null, 2) : "No custom user transaction data provided for this request."}

Instructions:
1. If financial context data is provided above, use it to give personalized analysis, exact calculations, and tailored recommendations.
2. If financial context data is not provided or incomplete, DO NOT refuse to answer. Instead, answer the user's question thoroughly using standard personal finance principles, clear calculations, rules of thumb (e.g., 50/30/20 rule, emergency fund sizing, zero-based budgeting), and step-by-step actionable advice.
3. Be concise, practical, encouraging, and easy to read.

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
