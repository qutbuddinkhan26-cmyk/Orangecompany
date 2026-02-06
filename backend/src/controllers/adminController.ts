import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Service from '../models/Service';
import Category from '../models/Category';
import Booking from '../models/Booking';
import mongoose from 'mongoose';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const [usersCount, bookingsCount, servicesCount, totalRevenue] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Service.countDocuments(),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        users: usersCount,
        bookings: bookingsCount,
        services: servicesCount,
        revenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        revenueByMonth,
        bookingTrends
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching analytics', error: error.message });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    
    const query: any = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      query.isActive = status === 'active';
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid user ID' });
      return;
    }
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    
    const bookingsCount = await Booking.countDocuments({ userId: id });
    
    res.json({
      success: true,
      user,
      meta: {
        bookingsCount
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { role, isActive } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid user ID' });
      return;
    }
    
    const updateData: any = {};
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid user ID' });
      return;
    }
    
    if (id === req.user?.userId) {
      res.status(400).json({ success: false, message: 'Cannot delete your own account' });
      return;
    }
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
};

export const getAllServices = async (req: AuthRequest, res: Response) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.categoryId = category;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('categoryId', 'name slug')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Service.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      services,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching services', error: error.message });
  }
};

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      categoryId,
      basePrice,
      discountPercentage,
      durationMinutes,
      whatIncluded,
      whatExcluded,
      isActive,
      isFeatured
    } = req.body;
    
    if (!name || !description || !categoryId || !basePrice || !durationMinutes) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const existingService = await Service.findOne({ slug });
    if (existingService) {
      res.status(400).json({ success: false, message: 'Service with this name already exists' });
      return;
    }
    
    const service = await Service.create({
      name,
      slug,
      description,
      categoryId,
      basePrice,
      discountPercentage: discountPercentage || 0,
      durationMinutes,
      whatIncluded: whatIncluded || [],
      whatExcluded: whatExcluded || [],
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false
    });
    
    const populatedService = await Service.findById(service._id).populate('categoryId', 'name slug');
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: populatedService
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error creating service', error: error.message });
  }
};

export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid service ID' });
      return;
    }
    
    const {
      name,
      description,
      categoryId,
      basePrice,
      discountPercentage,
      durationMinutes,
      whatIncluded,
      whatExcluded,
      isActive,
      isFeatured
    } = req.body;
    
    const updateData: any = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description) updateData.description = description;
    if (categoryId) updateData.categoryId = categoryId;
    if (basePrice !== undefined) updateData.basePrice = basePrice;
    if (discountPercentage !== undefined) updateData.discountPercentage = discountPercentage;
    if (durationMinutes) updateData.durationMinutes = durationMinutes;
    if (whatIncluded) updateData.whatIncluded = whatIncluded;
    if (whatExcluded) updateData.whatExcluded = whatExcluded;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (typeof isFeatured === 'boolean') updateData.isFeatured = isFeatured;
    
    const service = await Service.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoryId', 'name slug');
    
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating service', error: error.message });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid service ID' });
      return;
    }
    
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting service', error: error.message });
  }
};

export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 });
    
    res.json({
      success: true,
      categories
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, icon, displayOrder, isActive } = req.body;
    
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      res.status(400).json({ success: false, message: 'Category with this name already exists' });
      return;
    }
    
    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid category ID' });
      return;
    }
    
    const { name, description, icon, displayOrder, isActive } = req.body;
    
    const updateData: any = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    
    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating category', error: error.message });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid category ID' });
      return;
    }
    
    const servicesCount = await Service.countDocuments({ categoryId: id });
    if (servicesCount > 0) {
      res.status(400).json({ 
        success: false, 
        message: `Cannot delete category. It has ${servicesCount} services associated with it.` 
      });
      return;
    }
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { search, status, page = 1, limit = 20, startDate, endDate } = req.query;
    
    const query: any = {};
    
    if (search) {
      query.bookingNumber = { $regex: search, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate as string);
      if (endDate) query.bookingDate.$lte = new Date(endDate as string);
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('userId', 'fullName email phone')
        .populate('serviceId', 'name thumbnail')
        .populate('addressId', 'fullAddress city')
        .populate('providerId', 'fullName email')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Booking.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      bookings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid booking ID' });
      return;
    }
    
    if (!status) {
      res.status(400).json({ success: false, message: 'Status is required' });
      return;
    }
    
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }
    
    const updateData: any = { status };
    
    if (status === 'completed') {
      updateData.completedAt = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('userId', 'fullName email phone')
      .populate('serviceId', 'name thumbnail')
      .populate('addressId', 'fullAddress city')
      .populate('providerId', 'fullName email');
    
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }
    
    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating booking status', error: error.message });
  }
};
