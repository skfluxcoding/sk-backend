const { verifyToken } = require("../utils/jwt.util");

exports.checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const [, token] = authHeader.split(' ');

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
}

exports.checkRoleUser = (req, res, next) => {
  const { roles } = req.user;
  if (!roles.includes('USER')) {
    return res.status(403).json({ message: 'Access forbidden: Requires USER role' });
  }
  next();
}

exports.checkRoleAdmin = (req, res, next) => {
  const { roles } = req.user;
  if (!roles.includes('ADMIN')) {
    return res.status(403).json({ message: 'Access forbidden: Requires ADMIN role' });
  }
  next();
}