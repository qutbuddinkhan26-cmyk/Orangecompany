import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { bookingId, rating, review, images } = req.body;

    // Validate input
    if (!bookingId || !rating || !review) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to review this booking' });
      return;
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      res.status(400).json({ message: 'Can only review completed bookings' });
      return;
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      res.status(400).json({ message: 'Review already exists for this booking' });
      return;
    }

    // Create review
    const newReview = new Review({
      userId,
      serviceId: booking.serviceId,
      bookingId,
      rating,
      review,
      images: images || [],
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: newReview,
    });
  } catch (error: any) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getServiceReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalReviews = await Review.countDocuments({ serviceId });
    const reviews = await Review.find({ serviceId })
      .populate('userId', 'fullName profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { serviceId: new mongoose.Types.ObjectId(serviceId as string) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalReviews / limit),
      totalReviews,
      averageRating: ratingStats.length > 0 ? ratingStats[0].averageRating : 0,
      reviews,
    });
  } catch (error: any) {
    console.error('Get service reviews error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUserReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user?.userId;
    const userRole = req.user?.role;

    // Check authorization - only own reviews or admin
    if (userId !== requestingUserId && userRole !== 'admin') {
      res.status(403).json({ message: 'Not authorized to view these reviews' });
      return;
    }

    const reviews = await Review.find({ userId })
      .populate('serviceId', 'name thumbnail')
      .populate('bookingId', 'bookingNumber bookingDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error: any) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { rating, review, images } = req.body;

    const existingReview = await Review.findById(id);
    if (!existingReview) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    // Check if review belongs to user
    if (existingReview.userId.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this review' });
      return;
    }

    // Check if review is within 7 days
    const reviewAge = Date.now() - existingReview.createdAt.getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    if (reviewAge > sevenDaysInMs) {
      res.status(400).json({ message: 'Review can only be updated within 7 days of creation' });
      return;
    }

    // Update fields
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        res.status(400).json({ message: 'Rating must be between 1 and 5' });
        return;
      }
      existingReview.rating = rating;
    }
    if (review !== undefined) existingReview.review = review;
    if (images !== undefined) existingReview.images = images;

    await existingReview.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: existingReview,
    });
  } catch (error: any) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    // Check authorization - owner or admin
    if (review.userId.toString() !== userId && userRole !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this review' });
      return;
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const addProviderResponse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const { response } = req.body;

    if (!response) {
      res.status(400).json({ message: 'Response text is required' });
      return;
    }

    // Check if user is a provider
    if (userRole !== 'provider' && userRole !== 'admin') {
      res.status(403).json({ message: 'Only providers can respond to reviews' });
      return;
    }

    const review = await Review.findById(id).populate('bookingId');
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    // Check if provider matches the booking provider (or is admin)
    const booking = await Booking.findById(review.bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (userRole !== 'admin' && booking.providerId?.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to respond to this review' });
      return;
    }

    review.response = response;
    review.respondedAt = new Date();
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      review,
    });
  } catch (error: any) {
    console.error('Add provider response error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
