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

  
  salaireMensuel: Number,
  contratUrl: String,
  peutTravaillerWeekend: { type: Boolean, default: false },
  peutTravaillerFeries: { type: Boolean, default: false },


  pinCode: {
    type: String,
    index: true,
    expires: 86400 
  },
  qrCodeImage: {
    type: Buffer,
    select: false ,
    expires : 86400
  },
  lastCodeSentAt: Date,

  // === Sécurité ===
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// === Middlewares ===
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// === Méthodes améliorées ===
userSchema.methods = {
  comparePassword: async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },

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

    return { 
      pinCode,
      qrData // À convertir en image dans le service d'email
    };
  },

  changedPasswordAfter: function(JWTTimestamp) {
    if (!this.passwordChangedAt) return false;
    return JWTTimestamp < parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  }
};

// === Indexes ===

userSchema.index({ lastCodeSentAt: 1 });

// === Virtuals ===
userSchema.virtual('attendances', {
  ref: 'Attendance',
  localField: '_id',
  foreignField: 'userId',
  options: { 
    sort: { date: -1 },
    match: { status: { $ne: 'holiday' } }
  }
});

module.exports = mongoose.model("User", userSchema);