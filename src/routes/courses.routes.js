const router = require('express').Router();
const controller = require('../controllers/course.controller');
const { checkJwt, checkRoleUserOrAdmin } = require('../middleware/auth.middleware');
const validateFields = require('../middleware/validateFields');
const { createCourse, validId, findAllCourses } = require('../validators/course.validator');

router.use(checkJwt);
router.use(checkRoleUserOrAdmin);
router.get('/', findAllCourses, validateFields, controller.findAll);
router.get('/:id', validId, validateFields, controller.findOne);
router.post('/', createCourse, validateFields, controller.create);
router.put('/:id', validId, validateFields, controller.update);
router.delete('/:id', validId, validateFields, controller.softDelete);

module.exports = router;
