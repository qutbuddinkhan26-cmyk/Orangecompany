import express from 'express';
import {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController';
import { authenticateToken } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/', authenticateToken, createLimiter, createAddress);
router.get('/', authenticateToken, apiLimiter, getUserAddresses);
router.get('/:id', authenticateToken, apiLimiter, getAddressById);
router.put('/:id', authenticateToken, apiLimiter, updateAddress);
router.delete('/:id', authenticateToken, apiLimiter, deleteAddress);
router.patch('/:id/default', authenticateToken, apiLimiter, setDefaultAddress);

export default router;
