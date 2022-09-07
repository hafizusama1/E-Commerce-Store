const express = require('express');
const data = require('../data');
const seedRouter = express.Router();
const Product = require('../models/product');
const User = require('../models/user');

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);

  await User.remove({});
  const createdUsers = await User.insertMany(data.users);

  res.status(200).json({ createdProducts, createdUsers });
});

module.exports = seedRouter;
