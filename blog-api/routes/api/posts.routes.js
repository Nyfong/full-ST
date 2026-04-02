const express = require('express');

const postController = require('../../controller/post.controller');
const postValidator = require('../../validators/post.validator');
const authMiddleware = require('../../middleware/auth.middleware');
const adminMiddleware = require('../../middleware/admin.middleware');
const validate = require('../../middleware/validate.middleware');

const router = express.Router();

router.get('/', postController.list);
router.get('/:id', postController.getById);
router.post('/', authMiddleware, postValidator.create, validate, postController.create);
router.put('/:id', authMiddleware, postValidator.update, validate, postController.update);
router.delete('/:id', authMiddleware, postController.remove);
router.delete('/admin/:id', authMiddleware, adminMiddleware, postController.adminRemove);

module.exports = router;

