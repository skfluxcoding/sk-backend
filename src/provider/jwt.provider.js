const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  return jwt.sign(
    {
      uid: user._id,
      roles: user.roles
    },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET_KEY);
}

module.exports = {
  generateAccessToken,
  verifyToken
}
