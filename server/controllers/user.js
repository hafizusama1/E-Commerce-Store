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

module.exports = { signin, signup, updateUser };
