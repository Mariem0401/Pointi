const Attendance = require('../Model/Attendance');
const User = require('../Model/User');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Fonction pour calculer le statut
function calculateStatus() {
  const hour = new Date().getHours();
  // Assuming 8 AM is the on-time cutoff in Tunis, Tunisia (UTC+1)
  return hour >= 8 ? 'late' : 'on-time';
}

exports.handleCheckIn = async (req, res) => {
  try {
    const { pinCode, qrCodeData } = req.body;

    // Input validation: Ensure at least one code is provided
    if (!pinCode && !qrCodeData) {
      return res.status(400).json({
        success: false,
        error: "Veuillez fournir un code PIN ou scanner le QR Code."
      });
    }

    let user;
    if (pinCode) {
      // Find user by current pinCode. Ensure the pinCode field is exactly matched.
      user = await User.findOne({ pinCode: pinCode.toUpperCase() }); // Convert to uppercase for consistent comparison
    } else if (qrCodeData) {
      // Find user by current qrCodeData.
      user = await User.findOne({ qrCode: qrCodeData });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Code PIN ou QR Code invalide ou expiré."
      });
    }

    // 2. Vérifier si déjà pointé aujourd'hui pour *cet* utilisateur
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to start of current day

    const existingAttendance = await Attendance.findOne({
      userId: user._id,
      date: { $gte: todayStart } // Find attendance for THIS user starting from today
    });

    if (existingAttendance) {
      // If checkOut exists, they completed their day
      if (existingAttendance.checkOut) {
        return res.status(400).json({
          success: false,
          error: "Pointage complet pour aujourd'hui. Vous avez déjà pointé entrée et sortie."
        });
      } else {
        // If checkOut does not exist, they have already checked in
        return res.status(400).json({
          success: false,
          error: "Vous avez déjà pointé votre entrée ce matin."
        });
      }
    }

    // 3. Enregistrer le pointage d'entrée
    const attendance = await Attendance.create({
      userId: user._id,
      date: new Date(),
      checkIn: new Date(),
      status: calculateStatus()
    });

    // *** IMPORTANT CHANGE HERE ***
    // DO NOT generate a new PIN or update user.pinCode after check-in.
    // The same PIN needs to be valid for check-out.
    // The PIN will only be invalidated AFTER successful check-out.
    // const newPin = crypto.randomBytes(3).toString('hex').toUpperCase();
    // user.pinCode = newPin;
    // await user.save();

    res.status(201).json({
      success: true,
      message: "Pointage d'entrée enregistré avec succès !",
      data: attendance
    });

  } catch (error) {
    console.error("Erreur handleCheckIn:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors du pointage d'entrée."
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