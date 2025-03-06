require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Microservice Targets
const services = {
  users: 'http://localhost:5001',
  products: 'http://localhost:5002',
  orders: 'http://localhost:5003',
};

// Middleware for JSON Parsing & CORS
app.use(express.json());
app.use(cors());

// Authentication Middleware
function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
}

// User Service Proxy
app.use('/api/users', createProxyMiddleware({ target: services.users, changeOrigin: true }));

// Product Service Proxy (Protected)
app.use('/api/products', verifyToken, createProxyMiddleware({ target: services.products, changeOrigin: true }));

// Order Service Proxy (Protected)
app.use('/api/orders', verifyToken, createProxyMiddleware({ target: services.orders, changeOrigin: true }));

// Start API Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
