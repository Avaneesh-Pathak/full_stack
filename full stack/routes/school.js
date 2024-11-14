const express = require('express');
const router = express.Router();
const { createSchool, getSchools, updateSchool, deleteSchool, getSchoolById } = require('../controllers/school');
/* User Routes */
router.get('/', getSchools);
router.get('/:id', getSchoolById);
router.post('/create', createSchool);
router.patch('/update', updateSchool);
router.delete('/:id', deleteSchool);

router.use('*', function (req, res) {
    return res.status(400).json({
        message: 'invalid route',
        data: {}
    });
})

module.exports = router;