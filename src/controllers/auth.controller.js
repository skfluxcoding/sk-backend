const User = require('../models/user.model');
const passwordUtil = require('../utils/password.util');
const jwtUtil = require('../utils/jwt.util');

exports.register = async (req, res) => {
  let { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = await passwordUtil.hash(password);

  const user = await User.create({
    email,
    password: hashedPassword
  });

  const token = jwtUtil.generateAccessToken(user);

  return res.status(201).json({ accessToken: token });
}

exports.login = async (req, res) => {
  let { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const match = await passwordUtil.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwtUtil.generateAccessToken(user);

  return res.status(200).json({ accessToken: token });
}

