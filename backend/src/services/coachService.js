const { Mistral } = require('@mistralai/mistralai');

/**
 * AI Financial Coach Service powered by Mistral AI
 * @param {string} userMessage - User query / prompt
 * @param {Object} userContext - Financial context data bundle
 * @returns {Promise<string>} Coach reply message
 */
async function askCoach(userMessage, userContext = {}) {
  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      console.warn('MISTRAL_API_KEY environment variable is not configured.');
      return "Mistral API key is not configured. Please add MISTRAL_API_KEY to your backend/.env file.";
    }

    const client = new Mistral({ apiKey });

    const systemPrompt = `You are a personal finance coach. Answer using ONLY the financial data provided. Be concise and specific with numbers. If data is missing, say so.\n\nUser Financial Context:\n${JSON.stringify(userContext || {}, null, 2)}`;

    const response = await client.chat.complete({
      model: 'open-mistral-7b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    return (
      response.choices?.[0]?.message?.content ||
      "I'm having trouble answering right now, please try again."
    );
  } catch (error) {
    console.error('Full error in coachService askCoach:', {
      message: error?.message,
      responseData: error?.response?.data,
      stack: error?.stack,
      rawError: error,
    });
    return "I'm having trouble analyzing your financial data right now. Please try again later.";
  }
}

module.exports = {
  askCoach,
};
