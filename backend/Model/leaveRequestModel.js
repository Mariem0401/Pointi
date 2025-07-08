const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Normal', 'Maladie', 'Parental', 'Sans solde'],
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value >= this.startDate;
      },
      message: "La date de fin doit être après la date de début."
    }
  },
  status: {
    type: String,
    enum: ['en attente', 'acceptée', 'refusée'],
    default: 'en attente'
  },
  decisionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  decisionDate: Date,
  comment: String
}, {
  timestamps: true
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

module.exports = LeaveRequest;
