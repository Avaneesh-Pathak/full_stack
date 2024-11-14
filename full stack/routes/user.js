const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/user');

/* User Routes */
router.post('/create', registerUser);
router.post('/login', loginUser);

router.use('*', function (req, res) {
    return res.status(400).json({
        message: 'invalid route',
        data: {}
    });
})

module.exports = router;