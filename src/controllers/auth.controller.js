const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  const token = await authService.register(req.body);
  return res.status(201).json({ accessToken: token });
}

exports.login = async (req, res) => {
  const token = await authService.login(req.body);
  return res.status(200).json({ accessToken: token });
}