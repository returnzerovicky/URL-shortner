const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const urlRoutes = require('./routes/url');

dotenv.config();
const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/', urlRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Connect to DB and start server when run directly
if (require.main === module) {
  (async () => {
    try {
      await connectDB(process.env.MONGODB_URI);
      const port = process.env.PORT || 3000;
      app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (err) {
      console.error('Failed to start server', err);
      process.exit(1);
    }
  })();
}

module.exports = app;
