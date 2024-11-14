const express = require('express');
const router = express.Router();
const { getRecentData, getUpcomingRenewal, getTotalSchools, getTotalStudents, getGenderBreakup } = require('../controllers/dashboard');

/* User Routes */
// router.get('/total', getRecentData);
// router.get('/renewal', getUpcomingRenewal);
router.get('/yearly-breakup', getTotalSchools);
router.get('/yearly-student-breakup', getTotalStudents);
router.get('/yearly-gender-breakup', getGenderBreakup);
// router.get('/',getUsers);

router.use('*', function (req, res) {
    return res.status(400).json({ message: 'invalid route', data: {} });
})

module.exports = router;