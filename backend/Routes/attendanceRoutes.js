const express = require('express');
const router = express.Router();
const attendanceController = require('../Controller/attendanceController');

router.post('/checkin', attendanceController.handleCheckIn);
router.post('/checkout', attendanceController.handleCheckOut);
router.get('/daily', attendanceController.getDailyAttendance);
router.get('/user/:userId', attendanceController.getAttendanceByUser);
router.get('/all', attendanceController.getAllAttendance);
router.get('/monthly', attendanceController.getMonthlyAttendance); // cette ligne est essentielle
router.get('/monthly-summary', attendanceController.getMonthlySummary); // <-- à ajouter

module.exports = router;
