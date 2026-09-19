const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth.middleware');
const { askCoach } = require('../controllers/coachController');

router.post('/ask', verifyAuth, askCoach);

module.exports = router;
