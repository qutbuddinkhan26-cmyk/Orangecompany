import express from 'express';
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('admin'), createLimiter, createCoupon);
router.get('/', authenticateToken, authorizeRole('admin'), apiLimiter, getCoupons);
router.get('/:id', authenticateToken, authorizeRole('admin'), apiLimiter, getCouponById);
router.put('/:id', authenticateToken, authorizeRole('admin'), createLimiter, updateCoupon);
router.delete('/:id', authenticateToken, authorizeRole('admin'), createLimiter, deleteCoupon);
router.post('/validate', apiLimiter, validateCoupon);

export default router;
