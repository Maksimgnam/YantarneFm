const mongoose = require('mongoose');

const authCodeSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 60 * 1000) 
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


authCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


authCodeSchema.index({ telegramId: 1, code: 1 });
authCodeSchema.index({ telegramId: 1, isUsed: 1 });

module.exports = mongoose.model('AuthCode', authCodeSchema);