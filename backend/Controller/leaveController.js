const LeaveRequest = require('../Model/leaveRequestModel');
const User = require('../Model/User');
const Notification = require('../Model/Notification');

exports.createLeaveRequest = async (req, res) => {
  try {
    const { type, reason, startDate, endDate } = req.body;

    // 🔒 Vérifie la présence d’un justificatif si nécessaire
    if ((type === 'Maladie' || type === 'Parental') && !req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'Un justificatif est requis pour ce type de congé.',
      });
    }

    // 📝 Créer la demande de congé
    const leave = await LeaveRequest.create({
      employee: req.user._id,
      type,
      reason,
      startDate,
      endDate,
      justificatifUrl: req.file ? req.file.path : undefined,
    });

    // 📢 Trouver tous les RH et Admins
    const receveurs = await User.find({ role: { $in: ["rh", "admin"] } });

    // 🔔 Créer une notification pour chaque RH/Admin
    const notifications = receveurs.map(user => ({
      destinataire: user._id,
      type: "demande",
      message: `Nouvelle demande de congé de ${req.user.name}`,
      leaveRequest: leave._id
    }));

    await Notification.insertMany(notifications);

    // ✅ Réponse au frontend
    return res.status(201).json({
      status: 'success',
      message: 'Demande de congé envoyée et notifications envoyées.',
      data: leave,
    });

  } catch (error) {
    console.error("[createLeave] Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        status: 'error',
        message: "Erreur lors de la création de la demande de congé.",
        error: error.message,
      });
    }
  }
};


// RH ou admin traite une demande
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const { id } = req.params;

    if (!['acceptée', 'refusée'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const leave = await LeaveRequest.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Demande introuvable' });
    }

    leave.status = status;
    leave.decisionBy = req.user.id;
    leave.decisionDate = new Date();
    leave.comment = comment || '';
    await leave.save();

    res.status(200).json({ status: 'success', data: leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Liste des demandes de l’employé
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Liste pour RH (toutes les demandes sauf la sienne)
exports.getAllLeavesForRH = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: { $ne: req.user.id } })
      .populate('employee', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: leaves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
