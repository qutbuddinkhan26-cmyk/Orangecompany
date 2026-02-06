import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/bookingController';
import { authenticateToken } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/', authenticateToken, createLimiter, createBooking);
router.get('/', authenticateToken, apiLimiter, getUserBookings);
router.get('/:id', authenticateToken, apiLimiter, getBookingById);
router.patch('/:id/cancel', authenticateToken, apiLimiter, cancelBooking);

export default router;
