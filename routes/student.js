const express = require('express');
const router = express.Router();
const { createStudent, getStudents, updateStudent, deleteStudent, getStudentById } = require('../controllers/student');
/* User Routes */
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/create', createStudent);
router.patch('/update', updateStudent);
router.delete('/:id', deleteStudent);

router.use('*', function (req, res) {
    return res.status(400).json({
        message: 'invalid route',
        data: {}
    });
})

module.exports = router;