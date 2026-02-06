import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
} from '../controllers/serviceController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', authenticateToken, authorizeRole('admin'), createService);

export default router;
