const { askCoach: askCoachService } = require('../services/coachService');

async function askCoach(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    // Pass empty object as userContext for now; real financial context from Members A/B/C will be wired once ready
    const userContext = {};
    const reply = await askCoachService(message.trim(), userContext);

    return res.json({ reply });
  } catch (error) {
    console.error('Error in coachController.askCoach:', error);
    return res.status(500).json({ error: 'Failed to process coach request', details: error.message });
  }
}

module.exports = {
  askCoach,
};
