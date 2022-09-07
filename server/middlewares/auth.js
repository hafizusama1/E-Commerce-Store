const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
};

const isAuth = (req, res, next) => {
  // const authorization = req.headers.authorization;
  // if (authorization) {
  //   const token = authorization.slice(7, authorization.length);
  //   console.log(token);
  //   jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
  //     if (err) {
  //       res.status(401).send({ message: 'Invalid Token' });
  //       console.log(err);
  //     } else {
  //       req.user = decode;
  //       next();
  //     }
  //   });
  // } else {
  //   res.status(401).send({ message: 'No Token' });
  // }

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401).json({
      message: 'Wrong token',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(401).json({
        message: 'Invalid Token',
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(404).json({
      message: 'No Token',
    });
    console.log(error);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(400).json({ message: 'Invalid Admin Token' });
  }
};

module.exports = { generateToken, isAuth, isAdmin };
