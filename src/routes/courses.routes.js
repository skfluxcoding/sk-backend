const router = require('express').Router();
const controller = require('../controllers/course.controller');
const { checkJwt, checkRoleUserOrAdmin } = require('../middleware/auth.middleware');
const validateFields = require('../middleware/validateFields');
const validateObjectId = require('../middleware/validateObjectId.middleware');
const { createCourse, findAllCourses, updateCourse } = require('../validators/course.validator');

router.use(checkJwt);
router.use(checkRoleUserOrAdmin);
router.get('/', findAllCourses, validateFields, controller.paginate);
router.get('/:id', validateObjectId, controller.findOne);
router.post('/', createCourse, validateFields, controller.create);
router.put('/:id', validateObjectId, updateCourse, validateFields, controller.update);
router.delete('/:id', validateObjectId, controller.softDelete);

module.exports = router;
