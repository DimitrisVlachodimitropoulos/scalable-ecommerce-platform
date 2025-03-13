require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Log Incoming Requests
app.use((req, res, next) => {
    console.log('\n==========================================');
    console.log(`[Order Service] Incoming Request: ${req.method} ${req.originalUrl}`);
    console.log(`[Order Service] Headers:`, req.headers);
    console.log(`[Order Service] Body:`, req.body);
    next();
});

// Routes
app.use('/api/orders', orderRoutes);

// Database Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected for Order Service'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Order Service running on http://localhost:${PORT}`);
});
