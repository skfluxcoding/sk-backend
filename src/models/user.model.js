const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    default: ['USER']
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
