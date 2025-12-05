const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const authMiddleware = require('../middleware/authmiddleware');

router.get('/user', authMiddleware, metricsController.getUserMetrics);
router.get('/admin', authMiddleware, metricsController.getAdminMetrics);

module.exports = router;