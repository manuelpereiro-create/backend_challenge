const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;