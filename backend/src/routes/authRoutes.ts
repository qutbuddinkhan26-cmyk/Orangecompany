import express from 'express';
import { register, login, getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);
router.delete('/account', authenticateToken, deleteAccount);

export default router;
