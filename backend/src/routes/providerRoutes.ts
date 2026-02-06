import express from 'express';
import {
  getProviderStats,
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  getProviderEarnings,
  getProviderReviews,
} from '../controllers/providerController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and provider role
router.use(authenticateToken);
router.use(authorizeRole('provider'));

// Dashboard stats
router.get('/stats', getProviderStats);

// Bookings management
router.get('/bookings', getProviderBookings);
router.patch('/bookings/:id/accept', acceptBooking);
router.patch('/bookings/:id/reject', rejectBooking);
router.patch('/bookings/:id/complete', completeBooking);

// Earnings
router.get('/earnings', getProviderEarnings);

// Reviews
router.get('/reviews', getProviderReviews);

export default router;
