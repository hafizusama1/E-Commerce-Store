const express = require('express');
const userController = require('../controllers/user');
const { isAuth } = require('../middlewares/auth');
const router = express.Router();

router.post('/signin', userController.signin);
router.post('/signup', userController.signup);
router.put('/profile', isAuth, userController.updateUser);

module.exports = router;
