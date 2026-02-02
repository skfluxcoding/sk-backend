const jwt = require('jsonwebtoken');
function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      roles: user.roles
    },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
}


function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id
    },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_JWT_EXPIRES_IN
    }
  );
}

function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
}
