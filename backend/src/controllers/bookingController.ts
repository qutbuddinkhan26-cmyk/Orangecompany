import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Service from '../models/Service';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {
      serviceId,
      bookingDate,
      timeSlot,
      addressId,
      specialInstructions,
    } = req.body;

    // Validate input
    if (!serviceId || !bookingDate || !timeSlot || !addressId) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    // Calculate amounts
    const totalAmount = service.basePrice;
    const discountAmount = (totalAmount * service.discountPercentage) / 100;
    const finalAmount = totalAmount - discountAmount;

    // Generate booking number
    const bookingNumber = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create booking
    const booking = new Booking({
      bookingNumber,
      userId,
      serviceId,
      bookingDate,
      timeSlot,
      addressId,
      totalAmount,
      discountAmount,
      finalAmount,
      specialInstructions,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const bookings = await Booking.find({ userId })
      .populate('serviceId', 'name thumbnail durationMinutes')
      .populate('addressId', 'fullAddress city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await Booking.findOne({ _id: id, userId })
      .populate('serviceId')
      .populate('addressId')
      .populate('providerId', 'fullName profilePhoto phone');

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { cancellationReason } = req.body;

    const booking = await Booking.findOne({ _id: id, userId });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      res.status(400).json({ message: 'Cannot cancel this booking' });
      return;
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = cancellationReason;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
