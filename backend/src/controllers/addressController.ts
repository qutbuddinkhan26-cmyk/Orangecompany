import { Response } from 'express';
import Address from '../models/Address';
import { AuthRequest } from '../middleware/auth';

export const createAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {
      label,
      fullAddress,
      landmark,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    if (!fullAddress || !city || !state || !pincode) {
      res.status(400).json({ 
        message: 'Missing required fields: fullAddress, city, state, and pincode are required' 
      });
      return;
    }

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = new Address({
      userId,
      label: label || 'home',
      fullAddress,
      landmark,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault: isDefault || false,
    });

    await address.save();

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      address,
    });
  } catch (error: any) {
    console.error('Create address error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUserAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error: any) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAddressById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const address = await Address.findOne({ _id: id, userId });

    if (!address) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    res.status(200).json({
      success: true,
      address,
    });
  } catch (error: any) {
    console.error('Get address error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const {
      label,
      fullAddress,
      landmark,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    const address = await Address.findOne({ _id: id, userId });

    if (!address) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    if (isDefault && !address.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    if (label !== undefined) address.label = label;
    if (fullAddress !== undefined) address.fullAddress = fullAddress;
    if (landmark !== undefined) address.landmark = landmark;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (pincode !== undefined) address.pincode = pincode;
    if (latitude !== undefined) address.latitude = latitude;
    if (longitude !== undefined) address.longitude = longitude;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address,
    });
  } catch (error: any) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const address = await Address.findOneAndDelete({ _id: id, userId });

    if (!address) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const setDefaultAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const address = await Address.findOne({ _id: id, userId });

    if (!address) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    await Address.updateMany({ userId }, { isDefault: false });

    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: 'Default address set successfully',
      address,
    });
  } catch (error: any) {
    console.error('Set default address error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
