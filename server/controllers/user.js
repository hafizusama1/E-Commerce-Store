const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('../middlewares/auth');

const signin = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: auth.generateToken(user),
      });
      return;
    }
  }
  res.status(401).json({ message: 'Invalid email or password' });
});

const signup = expressAsyncHandler(async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });

  const user = await newUser.save();
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: auth.generateToken(user),
  });
});

const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

const getUserById = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

const updateUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await user.save();
    return res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: auth.generateToken(updatedUser),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

const editUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();
    res.send({ message: 'User Updated', user: updatedUser });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.email === 'admin@example.com') {
      res.status(400).send({ message: 'Can Not Delete Admin User' });
      return;
    }
    await user.remove();
    res.send({ message: 'User Deleted' });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

module.exports = {
  signin,
  signup,
  updateUser,
  getAllUsers,
  editUser,
  getUserById,
  deleteUser,
};
