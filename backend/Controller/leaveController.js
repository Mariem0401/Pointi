const LeaveRequest = require('../Model/leaveRequestModel');
const User = require('../Model/User');

// Employé crée une demande
exports.createLeaveRequest = async (req, res) => {
  try {
    const { type, reason, startDate, endDate } = req.body;

    if (!type || !startDate || !endDate) {
      return res.status(400).json({ message: 'Données incomplètes.' });
    }

    const leave = await LeaveRequest.create({
      employee: req.user.id,
      type,
      reason,
      startDate,
      endDate
    });

    res.status(201).json({ status: 'success', data: leave });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
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
