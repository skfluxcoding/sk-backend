const { body, query, param } = require('express-validator');

exports.validLogin = [
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email inválido'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];