const express = require('express');
const orderController = require('../controllers/order');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/', auth.isAuth, orderController.addNewOrder);

router.get(
  '/summary',
  auth.isAuth,
  auth.isAdmin,
  orderController.getOrdersSummary
);

router.get('/my', auth.isAuth, orderController.myOrders);

router.get('/:id', auth.isAuth, orderController.showOrder);

module.exports = router;
