const express = require('express');
const router = express.Router();
const { createVaccinationHistory, getVaccinationHistorys, updateVaccinationHistory, deleteVaccinationHistory, getVaccinationHistoryById } = require('../controllers/vaccination-history');
/* User Routes */
router.get('/', getVaccinationHistorys);
router.get('/:id', getVaccinationHistoryById);
router.post('/create', createVaccinationHistory);
router.patch('/update', updateVaccinationHistory);
router.delete('/:id', deleteVaccinationHistory);

router.use('*', function (req, res) {
    return res.status(400).json({
        message: 'invalid route',
        data: {}
    });
})

module.exports = router;