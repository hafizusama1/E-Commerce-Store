const mongoose = require('mongoose');

const connectDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    console.log('Database Connected');
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDatabase;
