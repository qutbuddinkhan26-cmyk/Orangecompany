import { Response } from 'express';
import Booking from '../models/Booking';
import Review from '../models/Review';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export const getProviderStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const providerId = req.user?.userId;

    // Get total bookings count
    const totalBookings = await Booking.countDocuments({ providerId });

    // Get completed bookings for earnings
    const completedBookings = await Booking.find({ 
      providerId, 
      status: 'completed' 
    });

    // Calculate total earnings
    const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.finalAmount, 0);

    // Get today's earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = completedBookings.filter(
      booking => booking.completedAt && booking.completedAt >= today
    );
    const todayEarnings = todayBookings.reduce((sum, booking) => sum + booking.finalAmount, 0);

    // Get pending requests count
    const pendingCount = await Booking.countDocuments({ 
      providerId, 
      status: 'pending' 
    });

    // Calculate average rating from reviews
    const reviews = await Review.find({
      bookingId: { $in: completedBookings.map(b => b._id) }
    });
    
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        todayEarnings,
        totalEarnings,
        totalBookings,
        pendingRequests: pendingCount,
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: reviews.length,
      },
    });
  } catch (error: any) {
    console.error('Get provider stats error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getProviderBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const providerId = req.user?.userId;
    const { status } = req.query;

    const filter: any = { providerId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('serviceId', 'name thumbnail durationMinutes')
      .populate('userId', 'fullName email phone profilePhoto')
      .populate('addressId', 'fullAddress landmark city state pincode')
      .sort({ bookingDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    console.error('Get provider bookings error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const acceptBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const providerId = req.user?.userId;

    const booking = await Booking.findOne({ _id: id, providerId });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.status !== 'pending') {
      res.status(400).json({ message: 'Only pending bookings can be accepted' });
      return;
    }

    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking accepted successfully',
      booking,
    });
  } catch (error: any) {
    console.error('Accept booking error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const rejectBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const providerId = req.user?.userId;
    const { cancellationReason } = req.body;

    const booking = await Booking.findOne({ _id: id, providerId });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.status !== 'pending') {
      res.status(400).json({ message: 'Only pending bookings can be rejected' });
      return;
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = cancellationReason || 'Rejected by provider';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking rejected successfully',
      booking,
    });
  } catch (error: any) {
    console.error('Reject booking error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const completeBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const providerId = req.user?.userId;

    const booking = await Booking.findOne({ _id: id, providerId });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.status !== 'confirmed' && booking.status !== 'in_progress') {
      res.status(400).json({ message: 'Only confirmed or in-progress bookings can be completed' });
      return;
    }

    booking.status = 'completed';
    booking.completedAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking marked as completed',
      booking,
    });
  } catch (error: any) {
    console.error('Complete booking error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getProviderEarnings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const providerId = req.user?.userId;

    const completedBookings = await Booking.find({ 
      providerId, 
      status: 'completed' 
    }).sort({ completedAt: -1 });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayEarnings = completedBookings
      .filter(b => b.completedAt && b.completedAt >= todayStart)
      .reduce((sum, b) => sum + b.finalAmount, 0);

    const weekEarnings = completedBookings
      .filter(b => b.completedAt && b.completedAt >= weekStart)
      .reduce((sum, b) => sum + b.finalAmount, 0);

    const monthEarnings = completedBookings
      .filter(b => b.completedAt && b.completedAt >= monthStart)
      .reduce((sum, b) => sum + b.finalAmount, 0);

    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.finalAmount, 0);

    // Format transactions for display
    const transactions = completedBookings.slice(0, 50).map(booking => ({
      id: booking._id,
      bookingNumber: booking.bookingNumber,
      amount: booking.finalAmount,
      date: booking.completedAt,
      serviceId: booking.serviceId,
    }));

    res.status(200).json({
      success: true,
      earnings: {
        today: todayEarnings,
        week: weekEarnings,
        month: monthEarnings,
        total: totalEarnings,
      },
      transactions,
    });
  } catch (error: any) {
    console.error('Get provider earnings error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getProviderReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const providerId = req.user?.userId;
    const { rating } = req.query;

    // Get all bookings for this provider
    const bookings = await Booking.find({ 
      providerId, 
      status: 'completed' 
    });

    const bookingIds = bookings.map(b => b._id);

    // Get reviews for these bookings
    const filter: any = { bookingId: { $in: bookingIds } };
    if (rating) {
      filter.rating = Number(rating);
    }

    const reviews = await Review.find(filter)
      .populate('userId', 'fullName profilePhoto')
      .populate('serviceId', 'name')
      .populate('bookingId', 'bookingNumber bookingDate')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    });
  } catch (error: any) {
    console.error('Get provider reviews error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
