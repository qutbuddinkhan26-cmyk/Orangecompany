import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import {
  getDashboardStats,
  getAnalytics,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllServices,
  createService,
  updateService,
  deleteService,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllBookings,
  updateBookingStatus
} from '../controllers/adminController';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken, authorizeRole('admin'));

// Dashboard & Analytics
router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalytics);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Service Management
router.get('/services', getAllServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Category Management
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Booking Management
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

export default router;
