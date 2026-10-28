const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', menuController.getMenus);                                // ทุกคน
router.post('/:id/rating', verifyToken, menuController.rateMenu);        // user ที่ login
router.post('/', verifyToken, isAdmin, menuController.createMenu);       // admin
router.delete('/:id', verifyToken, isAdmin, menuController.deleteMenu);  // admin

module.exports = router;
