const mongoose  = require("mongoose");
const validator = require("validator");
const bcrypt    = require("bcryptjs");

// Schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: 6
  },
  role: {
    type: String,
    enum: ["admin", "rh", "employe"],
    default: "employe",
     required: [true, "role is required"],
  },

  // Dans models/User.js


  // 🔗 Références vers Département et Poste
/*  departement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departement",
    required: true
  },
  poste: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poste",
    required: true
  },*/

  // RH
  salaireMensuel: {
    type: Number,
    default: 0
  },
  contratUrl: {
    type: String,
    default: ""
  },
  peutTravaillerWeekend: {
    type: Boolean,
    default: false
  },
  peutTravaillerFeries: {
    type: Boolean,
    default: false
  },

  // Pour les QR / PIN
  dernierCodePin: {
    type: String,
    default: null
  },
  dernierQrCodeUrl: {
    type: String,
    default: null
  },
  dateDernierCode: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
});

// Hash du mot de passe avant save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password        = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.verifPass = async function (entered, hashed) {
  return bcrypt.compare(entered, hashed);
};
userSchema.methods.changedPasswordTime = function (JWTiat) {
  return JWTiat > parseInt(this.update_pass_date.getTime() / 1000);
};
userSchema.methods.validTokenDate = function (JWTDate) {
  const dataPass = parseInt(this.update_pass_date.getTime() / 1000);
  return JWTDate < dataPass;
};
userSchema.virtual("attendances", {
  ref: "Attendance",
  localField: "_id",
  foreignField: "userId"
});

// Export du modèle
const User = mongoose.model("User", userSchema);
module.exports = User;
