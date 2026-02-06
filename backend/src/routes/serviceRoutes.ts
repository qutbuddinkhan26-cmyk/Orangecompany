import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
} from '../controllers/serviceController';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.get('/', apiLimiter, getAllServices);
router.get('/:id', apiLimiter, getServiceById);
router.post('/', authenticateToken, authorizeRole('admin'), createLimiter, createService);

export default router;
