const User = require('../models/user.model');
const passwordUtil = require('../utils/password.util');
const jwtUtil = require('../utils/jwt.util');

exports.register = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    email = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

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

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    email = email.trim().toLowerCase();

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

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

