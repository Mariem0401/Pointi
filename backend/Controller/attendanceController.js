const Attendance = require('../Model/Attendance');
const User = require('../Model/User');
const QRCode = require('qrcode');
const crypto = require('crypto');
const moment = require('moment-timezone');
const LeaveRequest = require("../Model/leaveRequestModel");

const TIMEZONE = 'Africa/Tunis';

// Validation des codes
function validateCodes(pinCode, qrCodeData) {
  if (!pinCode && !qrCodeData) {
    return { valid: false, error: "Veuillez fournir un code PIN ou scanner le QR Code." };
  }
  if (pinCode && !/^[A-Z0-9]{6}$/.test(pinCode)) {
    return { valid: false, error: "Format de code PIN invalide (6 caractères alphanumériques)." };
  }
  return { valid: true };
}

function calculateStatus() {
  const hour = moment().tz(TIMEZONE).hours();
  return hour >= 8 ? 'late' : 'on-time';
}

async function checkLeaveStatus(userId) {
  const today = moment().tz(TIMEZONE).startOf('day');
  const leave = await LeaveRequest.findOne({
    employee: userId,
    status: "acceptée",
    startDate: { $lte: today.toDate() },
    endDate: { $gte: today.toDate() }
  });
  return {
    onLeave: !!leave,
    leaveData: leave
  };
}

const attendanceController = {

  handleCheckIn: async (req, res) => {
    try {
      const { pinCode, qrCodeData } = req.body;
      const validation = validateCodes(pinCode, qrCodeData);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      const user = await User.findOne(
        pinCode ? { pinCode: pinCode.toUpperCase() } : { qrCode: qrCodeData }
      ).select('_id pinCode qrCode');

      if (!user) {
        return res.status(400).json({ success: false, error: "Code invalide ou expiré." });
      }

      const { onLeave } = await checkLeaveStatus(user._id);
      if (onLeave) {
        return res.status(400).json({ success: false, error: "Vous êtes en congé aujourd'hui." });
      }

      const todayStart = moment().tz(TIMEZONE).startOf('day').toDate();
      const existing = await Attendance.findOne({
        user: user._id,
        date: { $gte: todayStart }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          error: existing.checkOut ? "Pointage complet pour aujourd'hui." : "Vous avez déjà pointé votre entrée."
        });
      }

      const attendance = await Attendance.create({
        user: user._id,
        date: moment().tz(TIMEZONE).toDate(),
        checkIn: moment().tz(TIMEZONE).toDate(),
        status: calculateStatus()
      });

      res.status(201).json({ success: true, message: "Entrée enregistrée !", data: attendance });

    } catch (error) {
      console.error("Erreur check-in:", error);
      res.status(500).json({ success: false, error: "Erreur serveur" });
    }
  },

  handleCheckOut: async (req, res) => {
    try {
      const { pinCode, qrCodeData } = req.body;

      if (!pinCode && !qrCodeData) {
        return res.status(400).json({ success: false, error: "Veuillez fournir un code PIN ou scanner le QR Code." });
      }

      const user = await User.findOne(
        pinCode ? { pinCode: pinCode.toUpperCase() } : { qrCode: qrCodeData }
      );

      if (!user) {
        return res.status(400).json({ success: false, error: "Code PIN ou QR Code invalide ou expiré." });
      }

      const todayStart = moment().tz(TIMEZONE).startOf('day').toDate();

      const attendance = await Attendance.findOne({
        user: user._id,
        date: { $gte: todayStart },
        checkOut: { $exists: false }
      });

      if (!attendance) {
        return res.status(400).json({ success: false, error: "Aucun pointage d'entrée trouvé pour aujourd'hui ou déjà clôturé." });
      }

      const checkOutTime = moment().tz(TIMEZONE).toDate();
      const workedHours = ((checkOutTime - attendance.checkIn) / (1000 * 60 * 60)).toFixed(2);

      attendance.checkOut = checkOutTime;
      attendance.workedHours = parseFloat(workedHours);
      await attendance.save();

      const newPin = crypto.randomBytes(3).toString('hex').toUpperCase();
      user.pinCode = newPin;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Pointage de sortie enregistré avec succès !",
        data: attendance
      });

    } catch (error) {
      console.error('Erreur handleCheckOut:', error);
      return res.status(500).json({ success: false, error: "Erreur serveur lors du pointage de sortie." });
    }
  },

  getDailyAttendance: async (req, res) => {
    try {
      const { date } = req.query;
      const queryDate = date ? new Date(date) : new Date();

      const startOfDay = new Date(queryDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(queryDate);
      endOfDay.setHours(23, 59, 59, 999);

      const attendanceRecords = await Attendance.find({
        date: { $gte: startOfDay, $lte: endOfDay }
      }).populate('user', 'name department');

      const filteredRecords = attendanceRecords.filter(record => record.user != null);

      const formattedData = filteredRecords.map(record => ({
        id: record._id,
        userId: record.user._id,
        name: record.user.name,
        department: record.user.department,
        date: record.date,
        checkIn: record.checkIn ? moment(record.checkIn).format('HH:mm') : null,
        checkOut: record.checkOut ? moment(record.checkOut).format('HH:mm') : null,
        status: record.status,
        hoursWorked: record.workedHours ?
          `${Math.floor(record.workedHours)}h${Math.round((record.workedHours % 1) * 60).toString().padStart(2, '0')}` : '0h00'
      }));

      res.status(200).json({ success: true, data: formattedData });

    } catch (error) {
      console.error('Error fetching daily attendance:', error);
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  },

  getAttendanceByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      let query = { user: userId };
      if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }

      const attendanceRecords = await Attendance.find(query).sort({ date: -1 });

      const history = attendanceRecords.map(record => ({
        date: record.date,
        checkIn: record.checkIn ? moment(record.checkIn).format('HH:mm') : null,
        checkOut: record.checkOut ? moment(record.checkOut).format('HH:mm') : null,
        status: record.status,
        hoursWorked: record.workedHours ?
          `${Math.floor(record.workedHours)}h${Math.round((record.workedHours % 1) * 60).toString().padStart(2, '0')}` : '0h00'
      }));

      res.status(200).json({ success: true, data: history });

    } catch (error) {
      console.error('Error fetching user attendance:', error);
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  },

  getAllAttendance: async (req, res) => {
    try {
      const attendances = await Attendance.find().populate('user', 'name department');
      res.status(200).json({ success: true, data: attendances });
    } catch (error) {
      console.error('Error fetching all attendance:', error);
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  },

  getMonthlyAttendance: async (req, res) => {
    try {
      const { month, year } = req.query;

      const now = moment().tz(TIMEZONE);
      const monthInt = parseInt(month) || now.month(); // 0-based month (Juillet = 6)
      const yearInt = parseInt(year) || now.year();

      const startOfMonth = moment.tz({ year: yearInt, month: monthInt, day: 1 }, TIMEZONE).startOf('day');
      const endOfMonth = moment(startOfMonth).endOf('month');

      const attendanceData = await Attendance.find({
        date: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() }
      }).populate('user', 'name department');

      res.json({ success: true, data: attendanceData });

    } catch (error) {
      console.error('Erreur lors de la récupération mensuelle :', error);
      res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
  }, 
  getMonthlySummary: async (req, res) => {
  try {
    const { month } = req.query; // format: "2025-07"

    if (!month) {
      return res.status(400).json({ success: false, error: "Le mois est requis (YYYY-MM)." });
    }

    const [year, monthIndex] = month.split('-').map(Number);
    const startDate = new Date(year, monthIndex - 1, 1);
    const endDate = new Date(year, monthIndex, 0, 23, 59, 59, 999);

    const records = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('user', 'name department');

    const summary = {};

    records.forEach(record => {
      const userId = record.user._id.toString();
      if (!summary[userId]) {
        summary[userId] = {
          id: userId,
          name: record.user.name,
          department: record.user.department,
          present: 0,
          absent: 0,
          late: 0,
          overtime: 0
        };
      }

      if (record.checkIn) summary[userId].present += 1;
      if (record.status === 'late') summary[userId].late += 1;
      if (record.workedHours && record.workedHours > 8) {
        summary[userId].overtime += record.workedHours - 8;
      }
    });

    const response = Object.values(summary);
    return res.status(200).json(response);

  } catch (err) {
    console.error("Erreur résumé mensuel :", err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
}

};


module.exports = attendanceController;
