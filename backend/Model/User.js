const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  // === Informations de base ===
  name: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email invalide"],
    index: true
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ["admin", "rh", "employe"],
    default: "employe",
    required: true
  },

  // === Données supplémentaires ===
  salaireMensuel: Number,
  contratUrl: String,
  peutTravaillerWeekend: { type: Boolean, default: false },
  peutTravaillerFeries: { type: Boolean, default: false },

  // === Codes QR & Pointage ===
  pinCode: {
    type: String,
    index: true,
    expires: 86400 
  },
  qrCodeImage: {
    type: Buffer,
    select: false,
    expires: 86400
  },
  lastCodeSentAt: Date,

  // === Sécurité ===
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  departement: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Departement"
},
phone: {
  type: String,
  trim: true,
  validate: {
    validator: function (val) {
      return validator.isMobilePhone(val, 'any');
    },
    message: 'Numéro de téléphone invalide'
  }
},
adresse: {
  type: String,
  trim: true
},

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// === Middleware: hash mot de passe ===
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  this.confirmPassword = undefined;
  next();
});


// === Méthodes ===
userSchema.methods = {

  // Vérifie si le mot de passe entré est correct
  comparePassword: async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },

  // Génère un pinCode + QR Code pour la journée
  generateDailyCodes: async function() {
    const pinCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const qrData = JSON.stringify({
      userId: this._id,
      pinCode,
      expiresAt: new Date(Date.now() + 86400000)
    });

    this.pinCode = pinCode;
    this.lastCodeSentAt = new Date();
    await this.save();

    return { pinCode, qrData };
  },

  // Vérifie si le mot de passe a été changé après l'émission du token
  changedPasswordAfter: function(JWTTimestamp) {
    if (!this.passwordChangedAt) return false;
    return JWTTimestamp < parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  }
};


// === Indexes ===
userSchema.index({ lastCodeSentAt: 1 });


// === Virtuals ===

// Lié aux pointages
userSchema.virtual('attendances', {
  ref: 'Attendance',
  localField: '_id',
  foreignField: 'userId',
  options: { 
    sort: { date: -1 },
    match: { status: { $ne: 'holiday' } }
  }
});

// Lié aux contrats
userSchema.virtual('contracts', {
  ref: 'Contract',
  localField: '_id',
  foreignField: 'employee'
});


// === Modèle ===
const User = mongoose.model("User", userSchema);
module.exports = User;
