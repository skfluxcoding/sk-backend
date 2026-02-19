const { body, query, param } = require('express-validator');

exports.validateCreateUser = [
    body('email')
        .notEmpty().withMessage('Email es obligatorio')
        .isEmail().withMessage('Email inválido'),

    body('password')
        .notEmpty().withMessage('Password es obligatorio')
        .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),

    body('roles')
        .optional()
        .isArray().withMessage('Roles debe ser un array')

];