require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/products', productRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`Product Service running on http://localhost:${PORT}`);
});
