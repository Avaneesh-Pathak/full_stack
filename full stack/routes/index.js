const express = require('express');
const router = express.Router();

/* MAIN ROUTES */
router.use('/invoice', require('./invoice'));
router.use('/school', require('./school'));
router.use('/student', require('./student'));
router.use('/dashboard', require('./dashboard'));
router.use('/vaccination-history', require('./vaccination-history'));

module.exports = router;