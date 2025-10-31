const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
  createOrder,
  getPendingOrders,
  acceptOrder,
  startOrder,
  deliverOrder
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/pending', authenticate, getPendingOrders);
router.put('/:id/accept', authenticate, acceptOrder);
router.put('/:id/start', authenticate, startOrder);
router.put('/:id/deliver', authenticate, deliverOrder);

module.exports = router;