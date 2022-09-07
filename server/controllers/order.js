const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/order');
const User = require('../models/user');

const addNewOrder = expressAsyncHandler(async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems.map((x) => ({
      ...x,
      product: x._id,
    })),
    shippingAddress: req.body.shippingAddress,
    createdAt: req.body.createdAt,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id,
  });

  const order = await newOrder.save();
  res.status(201).json({ message: 'New order created', order });
});

const getOrdersSummary = expressAsyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json({ users, orders });
  console.log(users, orders);
});

const myOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(201).json(orders);
});

const showOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.status(201).json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

module.exports = { addNewOrder, showOrder, myOrders, getOrdersSummary };
