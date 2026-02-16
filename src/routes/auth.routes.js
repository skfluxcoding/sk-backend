const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const { validLogin } = require('../validators/auth.validator');
const validateFields = require('../middleware/validateFields');

router.use(validLogin);
router.use(validateFields);

router.post('/register', controller.register);
router.post('/login', controller.login);

module.exports = router;
