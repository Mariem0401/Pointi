
const Notification = require('../Model/Notification');



exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ destinataire: req.user.id })
      .populate("demandeConge")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Marquer toutes comme lues
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ destinataire: req.user.id, lu: false }, { lu: true });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "employe") {
      filter = { destinataire: req.user.id, type: "réponse" };
    } else if (["rh", "admin"].includes(req.user.role)) {
      filter = { destinataire: req.user.id, type: "demande" };
    }

    const notifications = await Notification.find(filter)
      .populate("leaveRequest")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", data: notifications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};


/*exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ destinataire: req.user.id })
      .populate("leaveRequest")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", data: notifications });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};*/

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ destinataire: req.user.id, lu: false }, { lu: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

