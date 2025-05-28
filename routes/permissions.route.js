const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const auth = require('../middleware/auth');
const permissionsController = require('../controller/permissions.controller');

router.patch('/:userId', auth, isAdmin, permissionsController.updateUserPermissions);

module.exports = router;
