const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  await authService.register(req.body);

  return res.status(201).json({
    ok: true,
    message: 'User registered successfully. Please check your email for the verification code.'
  });
};

exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  const token = await authService.verifyEmail(email, code);

  return res.status(200).json({
    ok: true,
    message: 'Email verified successfully.',
    token
  });
}

exports.login = async (req, res) => {
  const result = await authService.login(req.body);

  return res.status(200).json({
    ok: true,
    ...result
  });
};
