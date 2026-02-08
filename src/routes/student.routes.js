const router = require('express').Router();
const controller = require('../controllers/student.controller');
const validateObjectId = require('../middleware/validateObjectId.middleware');

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', validateObjectId, controller.get);
router.put('/:id', validateObjectId, controller.update);
router.delete('/:id', validateObjectId, controller.remove);

module.exports = router;

router.patch('/:id/soft-delete', validateObjectId, controller.softDelete);
