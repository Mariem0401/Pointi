const mongoose = require('mongoose');

const STATUS = {
  UPCOMING: 'à venir',
  ACTIVE: 'actif',
  EXPIRED: 'expiré'
};

const contractSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rh: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contractType: {
    type: String,
    enum: ['CDI', 'CDD', 'Stage', 'Alternance'],
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (date) {
        return date >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      message: 'La date de début doit être aujourd\'hui ou dans le futur'
    }
  },
  endDate: {
    type: Date,
    required: function () {
      return this.contractType === 'CDD';
    },
    validate: {
      validator: function (date) {
        if (this.contractType === 'CDD') {
          return date > this.startDate;
        }
        return true;
      },
      message: 'La date de fin doit être après la date de début pour les CDD'
    }
  },
  position: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true,
    min: [0, 'Le salaire ne peut pas être négatif']
  },
  pdfPath: {
    type: String
  },
  status: {
    type: String,
    enum: Object.values(STATUS),
    default: STATUS.UPCOMING
  }
}, { timestamps: true });

// Middleware pour mettre à jour automatiquement le statut avant chaque sauvegarde
contractSchema.pre('save', function (next) {
  const now = new Date();

  if (this.startDate > now) {
    this.status = STATUS.UPCOMING;
  } else if (this.contractType === 'CDI' || now < this.endDate) {
    this.status = STATUS.ACTIVE;
  } else {
    this.status = STATUS.EXPIRED;
  }

  next();
});

// Méthode pour vérifier si le contrat est actif
contractSchema.methods.isActive = function () {
  const now = new Date();
  return this.startDate <= now &&
    (this.contractType === 'CDI' || now < this.endDate);
};

// Méthode statique pour trouver les contrats expirés
contractSchema.statics.findExpired = function () {
  return this.find({
    $or: [
      { contractType: 'CDD', endDate: { $lt: new Date() } },
      { status: STATUS.EXPIRED }
    ]
  });
};

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
