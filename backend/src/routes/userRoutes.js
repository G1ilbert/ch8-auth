const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// ทุก route ในไฟล์นี้ admin เท่านั้น
router.use(verifyToken, isAdmin);
router.get('/', userController.getUsers);
router.put('/:id/role', userController.updateRole);

module.exports = router;
