const express = require('express');
const router = express.Router();

const { getInvoices, createInvoice, deleteInvoice, getCompanyFrom, getCompanyTo } = require('../controllers/invoice');
/* User Routes */
router.get('/', getInvoices);
// router.get('/:id', getStudentById);
router.post('/create', createInvoice);
// router.patch('/update', updateStudent);
router.delete('/:id', deleteInvoice);
router.get('/company-from', getCompanyFrom);
router.get('/company-to', getCompanyTo);

router.use('*', function (req, res) {
    return res.status(400).json({message: 'invalid route', data: {}});
})

module.exports = router;