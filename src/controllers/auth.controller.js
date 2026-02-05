const User = require('../models/user.model');
const RefreshToken = require('../models/refresh-token.model');
const passwordUtil = require('../utils/password.util');
const jwtUtil = require('../utils/jwt.util');
const refreshUtil = require('../utils/refresh-token.util');
const audit = require('../utils/audit.util');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'User already exists' });

  const user = await User.create({
    email,
    password: await passwordUtil.hash(password)
  });

  res.status(201).json({ message: 'User created' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log(user);
  
  if (!user) return res.sendStatus(401);

  const match = await passwordUtil.compare(password, user.password);
  if (!match) return res.sendStatus(401);

  /*await audit.log({
    userId: user._id,
    event: 'LOGIN',
    req
  });*/

  const token = jwtUtil.generateAccessToken(user);

  const refreshToken = jwtUtil.generateRefreshToken(user);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: refreshUtil.expirationDate()
  });

  res.json({ accessToken: token, refreshToken });
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(400);

  const stored = await RefreshToken.findOne({ token: refreshToken });

  // token inexistente o ya revocado = ataque
  if (!stored || stored.revoked) {
    await RefreshToken.updateMany(
      { userId: stored.userId },
      { revoked: true }
    );
    return res.sendStatus(401);
  }

  if (stored.expiresAt < new Date()) {
    return res.sendStatus(401);
  }

  const user = await User.findById(stored.userId);
  if (!user) return res.sendStatus(401);

  const newRefreshToken = refreshUtil.generate();

  stored.revoked = true;
  stored.replacedByToken = newRefreshToken;
  await stored.save();

  await RefreshToken.create({
    userId: user._id,
    token: newRefreshToken,
    expiresAt: refreshUtil.expirationDate()
  });

  const newAccessToken = jwtUtil.sign(user);

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
};


exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(400);

  await RefreshToken.updateOne(
    { token: refreshToken },
    { revoked: true }
  );

  res.sendStatus(204);
};

