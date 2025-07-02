// controllers/attendanceController.js
const Attendance = require("../models/Attendance");

exports.checkIn = async (req, res) => {
  const { userId, pinCode } = req.body;

  // 1. Vérifier le code PIN (exemple simplifié)
  const user = await User.findOne({ _id: userId, pinCode });
  if (!user) return res.status(400).json({ error: "Code invalide" });

  // 2. Enregistrer le pointage
  const attendance = await Attendance.create({ 
    userId,
    checkIn: new Date(),
    status: calculateStatus(user.role) // → "on-time" ou "late"
  });

  res.status(201).json(attendance);
};

// Calcul automatique du statut
function calculateStatus(role) {
  const now = new Date();
  const hour = now.getHours();
  return (role === "employe" && hour >= 8) ? "late" : "on-time";
}