const router = require('express').Router();
const controller = require('../controllers/course.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, controller.list);
router.get('/:id', authMiddleware, controller.get);
router.post('/', authMiddleware, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.remove);

module.exports = router;
