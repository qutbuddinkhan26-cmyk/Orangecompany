import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, phone, role } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
      res.status(400).json({ message: 'Email, password, and full name are required' });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      phone,
      role: role || 'customer',
    });

    await user.save();

    // Generate JWT token
    const secret = getJWTSecret();
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({ message: 'Account is deactivated' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const secret = getJWTSecret();
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { fullName, phone, dateOfBirth, profilePhoto } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        profilePhoto: user.profilePhoto,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const changePassword = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'New password must be at least 6 characters long' });
      return;
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const deleteAccount = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { password } = req.body;

    // Validate input
    if (!password) {
      res.status(400).json({ message: 'Password is required to delete account' });
      return;
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Password is incorrect' });
      return;
    }

    // Soft delete - deactivate account instead of deleting
    user.isActive = false;
    await user.save();

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
