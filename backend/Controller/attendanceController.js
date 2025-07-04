const Attendance = require('../Model/Attendance');
const User = require('../Model/User');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Fonction pour calculer le statut
function calculateStatus() {
  const hour = new Date().getHours();
  return hour >= 8 ? 'late' : 'on-time';
}

exports.handleCheckIn = async (req, res) => {
  try {
    const { pinCode, qrCodeData } = req.body;

    // 1. Trouver l'utilisateur par son code
    const user = await User.findOne({
      $or: [
        { pinCode: pinCode || null },
        { qrCode: qrCodeData || null }
      ]
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: "Code invalide ou expiré" 
      });
    }

    // 2. Vérifier si déjà pointé aujourd'hui
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      userId: user._id,
      date: { $gte: todayStart }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: existing.checkOut 
          ? "Pointage complet pour aujourd'hui"
          : "Vous avez déjà pointé ce matin"
      });
    }

    // 3. Enregistrer le pointage
    const attendance = await Attendance.create({
      userId: user._id,
      date: new Date(),
      checkIn: new Date(),
      status: calculateStatus()
    });

    // 4. Générer un nouveau code (optionnel)
    const newPin = crypto.randomBytes(3).toString('hex').toUpperCase();
    user.pinCode = newPin;
    await user.save();

    res.status(201).json({
      success: true,
      data: attendance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

exports.handleCheckOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Recherche du pointage à compléter
    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: todayStart },
      checkOut: { $exists: false }
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        error: "Aucun pointage à clôturer ou déjà pointé"
      });
    }

    // Calcul des heures travaillées
    const checkOutTime = new Date();
    const workedHours = ((checkOutTime - attendance.checkIn) / (1000 * 60 * 60)).toFixed(2);

    // Mise à jour du pointage
    attendance.checkOut = checkOutTime;
    attendance.workedHours = parseFloat(workedHours);
    await attendance.save();

    return res.status(200).json({
      success: true,
      data: attendance
    });

  } catch (error) {
    console.error('Erreur handleCheckOut:', error);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors du checkout"
    });
  }
};