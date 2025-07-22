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
  justificatifUrl: {
    type: String, // lien vers Cloudinary (PDF ou image)
    validate: {
      validator: function (v) {
        // Si c'est un congé maladie ou parental, le justificatif est requis
        if (['Maladie', 'Parental'].includes(this.type)) {
          return !!v;
        }
        return true;
      },
      message: 'Un justificatif est requis pour ce type de congé.'
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
  comment: {
    type: String,
    trim: true,
    validate: {
      validator: function (value) {
        // Si le statut est refusé, un commentaire est requis
        if (this.status === 'refusée') {
          return !!value && value.trim().length > 0;
        }
        return true;
      },
      message: 'Un commentaire est requis en cas de refus.'
    }
  }
}, {
  timestamps: true
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;
