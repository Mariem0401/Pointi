const mongoose = require("mongoose");
const User = require("./User"); // Assure-toi que le chemin est correct

const departementSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  postes: [{
    type: String,
    required: false
  }],
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  emailResponsable: {
    type: String,
    required: false,
    trim: true
  },
  employes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

/**
 * Middleware : Avant de sauvegarder un nouveau département
 */
departementSchema.pre('save', async function (next) {
  if (this.responsable) {
    const user = await User.findById(this.responsable);
    if (user) {
      this.emailResponsable = user.email;
    }
  }
  next();
});

/**
 * Middleware : Avant une mise à jour du département
 */
departementSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update.responsable) {
    const user = await User.findById(update.responsable);
    if (user) {
      update.emailResponsable = user.email;
    }
  }

  next();
});

module.exports = mongoose.model("Departement", departementSchema);
