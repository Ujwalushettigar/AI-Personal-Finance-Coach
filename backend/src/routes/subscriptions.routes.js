const express = require('express');
const controller = require('../controllers/subscriptionController');

const router = express.Router();

router.get('/', controller.getSubscriptions);
router.get('/recurring', controller.getRecurring);
router.get('/leaks', controller.getLeaks);
router.post('/detect', controller.detect);

module.exports = router;
