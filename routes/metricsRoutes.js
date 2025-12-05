const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


router.get('/user', authMiddleware, metricsController.getUserMetrics);
router.get('/admin', authMiddleware, roleMiddleware, metricsController.getAdminMetrics);

module.exports = router;