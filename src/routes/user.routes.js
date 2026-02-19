const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { checkJwt, checkRoleAdmin } = require('../middleware/auth.middleware');
const { validateCreateUser } = require('../validators/user.validator');
const validateFields = require('../middleware/validateFields');

const userRouter = Router();

userRouter.use(checkJwt);
userRouter.use(checkRoleAdmin);
userRouter.post('/', validateCreateUser, validateFields, userController.create);

module.exports = userRouter;