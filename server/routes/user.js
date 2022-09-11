const express = require('express');
const userController = require('../controllers/user');
const { isAuth, isAdmin } = require('../middlewares/auth');
const router = express.Router();

router.get('/', isAuth, isAdmin, userController.getAllUsers);
router.get('/:id', isAuth, isAdmin, userController.getUserById);
router.put('/:id', isAuth, isAdmin, userController.editUser);
router.delete('/:id', isAuth, isAdmin, userController.deleteUser);
router.post('/signin', userController.signin);
router.post('/signup', userController.signup);
router.put('/profile', isAuth, userController.updateUser);
module.exports = router;
