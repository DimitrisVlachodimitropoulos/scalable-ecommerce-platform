require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Log every request received
app.use((req, res, next) => {
    console.log('\n==========================================');
    console.log(`[User Service] Incoming Request: ${req.method} ${req.originalUrl}`);
    console.log(`[User Service] Headers:`, req.headers);
    console.log(`[User Service] Body:`, req.body);
    next();
});

// Routes
app.use('/api/users', authRoutes);

// Log when User Service sends a response
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[User Service] Response Sent: Status ${res.statusCode}`);
    });
    next();
});

// Database Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`User Service running on http://localhost:${PORT}`);
});
