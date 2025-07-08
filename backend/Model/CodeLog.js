const mongoose = require('mongoose');

const codeLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  pinCode: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'failed','used'],
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('CodeLog', codeLogSchema);