const Attendance = require('../Model/Attendance');
const User = require('../Model/User');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Fonction utilitaire pour calculer le statut
function calculateStatus() {
  const hour = new Date().getHours();
  return hour >= 8 ? 'late' : 'on-time';
}

// Fonction utilitaire pour mettre à jour les codes
async function updateUserCodes(user) {
  try {
    const newPin = crypto.randomBytes(3).toString('hex').toUpperCase();
    const qrData = JSON.stringify({
      userId: user._id,
      pin: newPin,
      expires: Date.now() + 86400000 // 24h
    });

    user.pinCode = newPin;
    user.qrCode = await QRCode.toDataURL(qrData);
    await user.save();
  } catch (error) {
    console.error('Erreur lors de la mise à jour des codes :', error);
    throw error;
  }
}

exports.handleCheckIn = async (req, res) => {
  try {
    const { qrCodeData, pinCode } = req.body;
    const userId = req.user._id;

    // Validation des données d'entrée
    if (!qrCodeData && !pinCode) {
      return res.status(400).json({
        success: false,
        error: "QR code ou PIN code requis"
      });
    }

    // Recherche de l'utilisateur avec vérification du code
    const query = { _id: userId };
    if (qrCodeData) query.qrCode = qrCodeData;
    if (pinCode) query.pinCode = pinCode;

    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "Code invalide ou expiré" 
      });
    }

    // Vérification du pointage existant
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      userId,
      date: { $gte: todayStart }
    });

    if (existingAttendance) {
      const message = existingAttendance.checkOut 
        ? "Pointage complet pour aujourd'hui"
        : "Vous avez déjà pointé ce matin";
      return res.status(400).json({
        success: false,
        error: message
      });
    }

    // Création du pointage
    const newAttendance = await Attendance.create({
      userId,
      date: new Date(),
      checkIn: new Date(),
      status: calculateStatus()
    });

    // Mise à jour des codes de sécurité
    await updateUserCodes(user);

    return res.status(201).json({
      success: true,
      data: newAttendance
    });

  } catch (error) {
    console.error('Erreur handleCheckIn:', error);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors du pointage"
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