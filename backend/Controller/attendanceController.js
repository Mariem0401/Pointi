const Attendance = require('../Model/Attendance');
const User = require('../Model/User');
const QRCode = require('qrcode');
const crypto = require('crypto');
const moment = require('moment-timezone');
const TIMEZONE = 'Africa/Tunis';
const LeaveRequest = require("../Model/leaveRequestModel");

// Fonction de validation des codes
function validateCodes(pinCode, qrCodeData) {
  if (!pinCode && !qrCodeData) {
    return { valid: false, error: "Veuillez fournir un code PIN ou scanner le QR Code." };
  }
  
  if (pinCode && !/^[A-Z0-9]{6}$/.test(pinCode)) {
    return { valid: false, error: "Format de code PIN invalide (6 caractères alphanumériques)." };
  }
  
  return { valid: true };
}

// Fonction pour calculer le statut
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

// ... le reste de votre code existant ...
exports.handleCheckIn = async (req, res) => {
  try {
    const { pinCode, qrCodeData } = req.body;

    // Validation des entrées
    const validation = validateCodes(pinCode, qrCodeData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne(
      pinCode ? { pinCode: pinCode.toUpperCase() } : { qrCode: qrCodeData }
    ).select('_id pinCode qrCode');

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Code invalide ou expiré."
      });
    }

    // Vérification des congés
    const { onLeave } = await checkLeaveStatus(user._id);
    if (onLeave) {
      return res.status(400).json({
        success: false,
        error: "Vous êtes en congé aujourd'hui."
      });
    }

    // Vérification des pointages existants
    const todayStart = moment().tz(TIMEZONE).startOf('day').toDate();
    const existing = await Attendance.findOne({
      userId: user._id,
      date: { $gte: todayStart }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: existing.checkOut 
          ? "Pointage complet pour aujourd'hui."
          : "Vous avez déjà pointé votre entrée."
      });
    }

    // Création du pointage
    const attendance = await Attendance.create({
      userId: user._id,
      date: moment().tz(TIMEZONE).toDate(),
      checkIn: moment().tz(TIMEZONE).toDate(),
      status: calculateStatus()
    });

    res.status(201).json({
      success: true,
      message: "Entrée enregistrée !",
      data: attendance
    });

  } catch (error) {
    console.error("Erreur check-in:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

exports.handleCheckOut = async (req, res) => {
  try {
    const { pinCode, qrCodeData } = req.body;

    // Input validation
    if (!pinCode && !qrCodeData) {
      return res.status(400).json({
        success: false,
        error: "Veuillez fournir un code PIN ou scanner le QR Code."
      });
    }

    let user;
    if (pinCode) {
      user = await User.findOne({ pinCode: pinCode.toUpperCase() });
    } else if (qrCodeData) {
      user = await User.findOne({ qrCode: qrCodeData });
    }

    if (!user) {
      // This error means the PIN used for checkout is no longer associated with a user,
      // which should only happen if it was changed prematurely or is genuinely wrong.
      return res.status(400).json({
        success: false,
        error: "Code PIN ou QR Code invalide ou expiré."
      });
    }

    // 2. Trouver le pointage du jour sans checkout pour *cet* utilisateur
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: user._id, // Ensure it's for THIS specific user
      date: { $gte: todayStart },
      checkOut: { $exists: false } // Only find records without a checkOut
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        error: "Aucun pointage d'entrée trouvé pour aujourd'hui ou déjà clôturé."
      });
    }

    // 3. Calculer et enregistrer le checkout
    const checkOutTime = new Date();
    const workedHours = ((checkOutTime - attendance.checkIn) / (1000 * 60 * 60)).toFixed(2);

    attendance.checkOut = checkOutTime;
    attendance.workedHours = parseFloat(workedHours);
    await attendance.save();

    // *** IMPORTANT CHANGE HERE ***
    // Generate a new PIN and update the user's record *after* successful check-out.
    // This makes the current PIN invalid for any future operations (e.g., next day's check-in
    // before the new daily PIN arrives, or accidental re-use).
    const newPin = crypto.randomBytes(3).toString('hex').toUpperCase();
    user.pinCode = newPin; // User gets a new PIN after checking out
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Pointage de sortie enregistré avec succès !",
      data: attendance
    });

  } catch (error) {
    console.error('Erreur handleCheckOut:', error);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors du pointage de sortie."
    });
  }
};