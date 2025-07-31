const express = require("express");
const router = express.Router();
const attendanceController = require('../Controller/attendanceController');

// Route pour le check-in (avec authentification requise)
router.post('/checkin', attendanceController.handleCheckIn);

// Route pour le check-out (avec authentification requise)
router.post('/checkout',  attendanceController.handleCheckOut);


module.exports = router; // Export correct du routeur