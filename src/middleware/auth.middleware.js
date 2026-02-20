const jwtProvider = require("../provider/jwt.provider");

exports.checkJwt = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = jwtProvider.verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

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

exports.checkRoleUserOrAdmin = (req, res, next) => {
  const { roles } = req.user;
  if (!roles.includes('USER') && !roles.includes('ADMIN')) {
    return res.status(403).json({ message: 'Access forbidden: Requires USER or ADMIN role' });
  }
  next();
}