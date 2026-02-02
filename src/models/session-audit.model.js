const mongoose = require('mongoose');

const SessionAuditSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  event: {
    type: String,
    enum: [
      'LOGIN',
      'REFRESH',
      'LOGOUT',
      'SESSION_REPLACED',
      'TOKEN_REUSE_DETECTED',
      'EXPIRED'
    ],
    required: true
  },
  deviceId: String,
  ipAddress: String,
  userAgent: String,
  metadata: Object
}, { timestamps: true });

module.exports = mongoose.model('SessionAudit', SessionAuditSchema);
