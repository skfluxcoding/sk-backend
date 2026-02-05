const User = require('../models/user.model');
const passwordUtil = require('../utils/password.util');
const jwtUtil = require('../utils/jwt.util');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'User already exists' });

  const user = await User.create({
    email,
    password: await passwordUtil.hash(password)
  });

  const token = jwtUtil.generateAccessToken(user);

  res.status(201).json({ accessToken: token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.sendStatus(401);

  const match = await passwordUtil.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwtUtil.generateAccessToken(user);

  res.json({ accessToken: token });
};
