const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentsController = require('../controller/comments.controller');

router.post('/', auth, commentsController.createComment);
router.get('/', auth, commentsController.getComments);
router.delete('/:id', auth, commentsController.deleteComment);

module.exports = router;
