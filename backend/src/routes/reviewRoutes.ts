import express from 'express';
import {
  createReview,
  getServiceReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  addProviderResponse,
} from '../controllers/reviewController';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Create review (authenticated users only)
router.post('/', authenticateToken, createLimiter, createReview);

// Get service reviews (public, with pagination)
router.get('/service/:serviceId', apiLimiter, getServiceReviews);

// Get user reviews (authenticated, own reviews only unless admin)
router.get('/user/:userId', authenticateToken, apiLimiter, getUserReviews);

// Update review (authenticated, owner only)
router.patch('/:id', authenticateToken, apiLimiter, updateReview);

// Delete review (authenticated, owner or admin)
router.delete('/:id', authenticateToken, apiLimiter, deleteReview);

// Add provider response (authenticated, provider role)
router.post('/:id/response', authenticateToken, authorizeRole('provider', 'admin'), apiLimiter, addProviderResponse);

export default router;
