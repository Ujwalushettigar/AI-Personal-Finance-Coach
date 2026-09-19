// Note: This controller will call coachService.js (LLM integration) later
async function askCoach(req, res) {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    return res.json({
      reply: 'Coach service not yet connected.',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process coach request', details: error.message });
  }
}

module.exports = {
  askCoach,
};
