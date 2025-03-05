require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));

// Proxy requests to microservices
const services = {
  users: 'http://localhost:5001',
  products: 'http://localhost:5002',
  orders: 'http://localhost:5003',
};

// User Service
app.use('/api/users', createProxyMiddleware({ target: services.users, changeOrigin: true }));

// Product Service
app.use('/api/products', createProxyMiddleware({ target: services.products, changeOrigin: true }));

// Order Service
app.use('/api/orders', createProxyMiddleware({ target: services.orders, changeOrigin: true }));

// Default route
app.get('/', (req, res) => {
  res.send('API Gateway is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
