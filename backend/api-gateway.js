require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Microservice Targets
const services = {
    users: 'http://localhost:5001',
    products: 'http://localhost:5002',
    orders: 'http://localhost:5003',
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Log every incoming request
app.use((req, res, next) => {
    console.log('\n==========================================');
    console.log(`[API Gateway] Incoming Request: ${req.method} ${req.originalUrl}`);
    console.log(`[API Gateway] Headers:`, req.headers);
    console.log(`[API Gateway] Body:`, req.body);
    next();
});

// Function to forward requests
const forwardRequest = async (serviceName, req, res) => {
  try {
      // Keep the full path `/api/users/login`
      const serviceUrl = services[serviceName] + req.originalUrl;
      console.log(`[API Gateway] Forwarding ${req.method} request to ${serviceName}: ${serviceUrl}`);

      // Forward the request to User Service
      const response = await axios({
          method: req.method,
          url: serviceUrl,
          headers: { ...req.headers, host: undefined },
          data: req.body,
      });

      console.log(`[API Gateway] Response from ${serviceName}: Status ${response.status}`);
      res.status(response.status).json(response.data);
  } catch (error) {
      console.error(`[API Gateway] Error forwarding request to ${serviceName}:`, error.message);

      if (error.response) {
          console.log(`[API Gateway] Error Response Data:`, error.response.data);
          res.status(error.response.status).json(error.response.data);
      } else {
          res.status(500).json({ error: `Gateway error: ${error.message}` });
      }
  }
};


// API Gateway Routes (Manual Forwarding)
app.use('/api/users', (req, res) => forwardRequest('users', req, res));
app.use('/api/products', (req, res) => forwardRequest('products', req, res));
app.use('/api/orders', (req, res) => forwardRequest('orders', req, res));

// Root Endpoint
app.get('/', (req, res) => {
    res.send('API Gateway is Running...');
});

// Log when API Gateway starts
app.listen(PORT, () => {
    console.log(`[API Gateway] Running on http://localhost:${PORT}`);
});
