const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date 
  },
  status: {
    type: String,
    enum: ["on-time", "late", "absent", "holiday"],
    default: "on-time"
  },
  workedHours: {
    type: Number, // En heures (ex: 8.5)
    default: 0
  }
}, { timestamps: true });

// Index pour accélérer les requêtes
attendanceSchema.index({ userId: 1, date: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
