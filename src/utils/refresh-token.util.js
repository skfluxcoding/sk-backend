const crypto = require('crypto');

exports.generate = () => {
  return crypto.randomBytes(64).toString('hex');
};

exports.expirationDate = (days = 7) => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};
