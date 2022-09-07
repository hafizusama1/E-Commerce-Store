require('dotenv').config();
const express = require('express');
const connectDatabase = require('./config/database');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const userRouter = require('./routes/user');
const seedRouter = require('./routes/seed');
const morgan = require('morgan');
const cors = require('cors');

//Connect Database
connectDatabase();

const app = express();

if (process.env.ENVIRONMENT === 'dev') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server started at port http://localhost:${port}`);
});

// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Logged Error: ${err}`);
//   server.close(() => process.exit(1));
// });
