import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Coupon from '../models/Coupon';
import mongoose from 'mongoose';

export const createCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const coupon = new Coupon(req.body);
    await coupon.save();

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon,
    });
  } catch (error: any) {
    console.error('Create coupon error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Coupon code already exists' });
      return;
    }
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getCoupons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    let query: any = {};

    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }

    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .populate('applicableServices', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Coupon.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getCouponById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const coupon = await Coupon.findById(req.params.id).populate('applicableServices', 'name');

    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error: any) {
    console.error('Get coupon error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('applicableServices', 'name');

    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon,
    });
  } catch (error: any) {
    console.error('Update coupon error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Coupon code already exists' });
      return;
    }
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const validateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, serviceId, orderAmount } = req.body;

    if (!code || !orderAmount) {
      res.status(400).json({ message: 'Coupon code and order amount are required' });
      return;
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      res.status(404).json({ message: 'Invalid coupon code' });
      return;
    }

    if (!coupon.isActive) {
      res.status(400).json({ message: 'Coupon is not active' });
      return;
    }

    const now = new Date();
    if (now < coupon.validFrom) {
      res.status(400).json({ message: 'Coupon is not yet valid' });
      return;
    }

    if (now > coupon.validTo) {
      res.status(400).json({ message: 'Coupon has expired' });
      return;
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      res.status(400).json({ message: 'Coupon usage limit reached' });
      return;
    }

    if (orderAmount < coupon.minOrderAmount) {
      res.status(400).json({
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`,
      });
      return;
    }

    if (serviceId && coupon.applicableServices.length > 0) {
      const isApplicable = coupon.applicableServices.some(
        (id) => id.toString() === serviceId
      );
      if (!isApplicable) {
        res.status(400).json({ message: 'Coupon is not applicable for this service' });
        return;
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, orderAmount);

    res.status(200).json({
      success: true,
      message: 'Coupon is valid',
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      finalAmount: orderAmount - discountAmount,
    });
  } catch (error: any) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
