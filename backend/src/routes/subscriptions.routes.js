const express = require('express');
const controller = require('../controllers/subscriptionController');
const { verifyAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyAuth);
router.post('/', controller.addSubscription);
router.get('/', controller.getSubscriptions);
router.get('/recurring', controller.getRecurring);
router.get('/leaks', controller.getLeaks);
router.post('/detect', controller.detect);

module.exports = router;
