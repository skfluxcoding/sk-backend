const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { validLogin } = require('../validators/auth.validator');
const validateFields = require('../middleware/validateFields');

router.post('/register', validLogin, validateFields, controller.register);
router.post('/login', validLogin, validateFields, controller.login);
router.post('/verify-email', controller.verifyEmail);
router.post('/resend-verification', controller.resendVerification);

module.exports = router;