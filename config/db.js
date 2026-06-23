const mongoose = require('mongoose');

async function connectDB(mongoUri) {
  const uri = mongoUri || process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not provided');

  try {
    // Mongoose 7+ no longer requires useNewUrlParser/useUnifiedTopology
    await mongoose.connect(uri, { maxPoolSize: 10 });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = connectDB;
