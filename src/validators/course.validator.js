const { body, query, param } = require('express-validator');

exports.createCourse = [
    body('title')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres'),

    body('description')
        .notEmpty().withMessage('La descripción es obligatoria'),

    body('instructor')
        .notEmpty().withMessage('Instructor requerido')
        .isMongoId().withMessage('Instructor inválido'),

    body('published')
        .optional()
        .isBoolean().withMessage('Published debe ser boolean')
];

exports.listCourses = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page debe ser >= 1'),

    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit debe ser >= 1')
];

exports.validId = [
    param('id')
        .notEmpty().withMessage('ID es obligatorio')
        .isMongoId().withMessage('ID inválido')
];