const { body, query, param } = require('express-validator');

exports.createCourse = [
    body('title')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres'),

    body('published')
        .optional()
        .isBoolean().withMessage('Published debe ser boolean')
];

exports.updateCourse = [
    body('title')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ min: 3 }).withMessage('Mínimo 3 caracteres'),
        
    body('published')
        .optional()
        .isBoolean().withMessage('Published debe ser boolean')
];

exports.findAllCourses = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page debe ser >= 1'),

    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit debe ser >= 1')
];