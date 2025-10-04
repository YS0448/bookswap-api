const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController')
const authenticate  = require('../middleware/authMiddleware')

router.post('/signup',authController.signup)
router.post('/login',authController.login)

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser); 



module.exports = router