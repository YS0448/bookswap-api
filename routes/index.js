const express = require('express'); 
const router = express.Router();
const authRoutes = require('./authRoutes');
const customerRoutes = require('./customerRoutes');

router.use('/auth', authRoutes);
router.use('/api',customerRoutes);  

module.exports = router;