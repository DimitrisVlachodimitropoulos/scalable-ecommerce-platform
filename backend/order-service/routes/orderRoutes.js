const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create an Order (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { products, totalPrice } = req.body;
    const order = new Order({ userId: req.user.userId, products, totalPrice });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get All Orders (Protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Order Status (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Order (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
