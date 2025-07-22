const express = require('express');
const router = express.Router();
const { calculateMonthlySalary } = require('../Controller/CalculerSalaireNet');
const { protectionMW, howCanDo } = require('../Controller/authController');

router.get('/', protectionMW, howCanDo("admin", "rh"), calculateMonthlySalary);

module.exports = router;
