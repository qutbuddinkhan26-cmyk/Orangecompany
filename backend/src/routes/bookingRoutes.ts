import express, { Response } from 'express';
import Booking from '../models/Booking';
import Service from '../models/Service';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { serviceId, date, time, address, notes } = req.body;
    if (!serviceId || !date || !time || !address) {
      res
        .status(400)
        .json({ message: 'serviceId, date, time, and address are required' });
      return;
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    const booking = await Booking.create({
      service: serviceId,
      customer: customerId,
      date,
      time,
      address,
      notes,
    });

    const populated = await booking.populate('service');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const bookings = await Booking.find({ customer: customerId })
      .populate({
        path: 'service',
        populate: { path: 'provider', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const booking = await Booking.findById(req.params.id).populate({
      path: 'service',
      populate: { path: 'provider', select: 'name email' },
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    const providerId = (booking.service as any)?.provider?._id;
    const isCustomer = String(booking.customer) === String(userId);
    const isProvider = providerId && String(providerId) === String(userId);

    if (!isCustomer && !isProvider) {
      res.status(403).json({ message: 'Not authorized to view this booking' });
      return;
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
});

router.put('/:id/status', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { status } = req.body;
    if (!status) {
      res.status(400).json({ message: 'Status is required' });
      return;
    }

    const booking = await Booking.findById(req.params.id).populate({
      path: 'service',
      populate: { path: 'provider', select: 'name email' },
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    const providerId = (booking.service as any)?.provider?._id;
    if (!providerId || String(providerId) !== String(userId)) {
      res
        .status(403)
        .json({ message: 'Not authorized to update booking status' });
      return;
    }

    booking.status = status;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (String(booking.customer) !== String(userId)) {
      res.status(403).json({ message: 'Not authorized to cancel this booking' });
      return;
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

export default router;
