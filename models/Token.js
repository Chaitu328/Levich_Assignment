const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['refresh', 'reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7 days
  }
});

module.exports = mongoose.model('Token', tokenSchema);