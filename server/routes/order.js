const express = require('express');
const orderController = require('../controllers/order');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/', auth.isAuth, auth.isAdmin, orderController.getAllOrders);

router.post('/', auth.isAuth, orderController.addNewOrder);

router.get(
  '/summary',
  auth.isAuth,
  auth.isAdmin,
  orderController.getOrdersSummary
);

router.put('/:id/deliver', auth.isAuth, orderController.isOrderDelivered);
router.get('/my', auth.isAuth, orderController.myOrders);

router.get('/:id', auth.isAuth, orderController.showOrder);

router.delete('/:id', auth.isAuth, auth.isAdmin, orderController.deleteOrder);
module.exports = router;
