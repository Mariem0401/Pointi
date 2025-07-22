// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  titre: String,
  message: String,
  type: {
    type: String,
    enum: ["demande", "réponse"], // demande = RH/Admin, réponse = Employé
  },
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  leaveRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveRequest",
  },
  lu: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
