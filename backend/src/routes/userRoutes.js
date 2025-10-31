// backend/src/routes/userRoutes.js
const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
  updateLocation,
  getProfile,
  getNearbyMandaderos
} = require('../controllers/userController');

const router = express.Router();

router.get('/me', authenticate, getProfile);
router.put('/location', authenticate, updateLocation);
router.get('/nearby-mandaderos', authenticate, getNearbyMandaderos);

module.exports = router;