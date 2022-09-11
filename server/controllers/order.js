const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');

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

const getAllOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name');
  res.send(orders);
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

  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({ users, orders, dailyOrders, productCategories });
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

const isOrderDelivered = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();
    res.status(200).json({ message: 'Order Delivered' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

const deleteOrder = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    await order.remove();
    res.send({ message: 'Order Deleted' });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

module.exports = {
  addNewOrder,
  getAllOrders,
  showOrder,
  myOrders,
  getOrdersSummary,
  isOrderDelivered,
  deleteOrder,
};
