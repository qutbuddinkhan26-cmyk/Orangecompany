import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { auth, AuthRequest } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

const getJWTSecret = (): string => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error('JWT_SECRET is not defined in environment variables');
	}
	return secret;
};

const generateToken = (user: { _id: string; role: string }) => {
	const secret = getJWTSecret();
	return jwt.sign({ id: user._id, role: user.role }, secret, {
		expiresIn: '7d',
	});
};

router.post('/register', authLimiter, async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			res.status(400).json({ message: 'Name, email, and password are required' });
			return;
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({ message: 'User already exists' });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await User.create({ name, email, password: hashedPassword });
		const token = generateToken(user);

		res.status(201).json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ message: 'Failed to register user' });
	}
});

router.post('/login', authLimiter, async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({ message: 'Email and password are required' });
			return;
		}

		const user = await User.findOne({ email });
		if (!user) {
			res.status(401).json({ message: 'Invalid email or password' });
			return;
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(401).json({ message: 'Invalid email or password' });
			return;
		}

		const token = generateToken(user);

		res.status(200).json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ message: 'Failed to login' });
	}
});

router.get('/profile', auth, async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			res.status(401).json({ message: 'Not authenticated' });
			return;
		}

		const user = await User.findById(userId).select('-password');
		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch profile' });
	}
});

router.put('/profile', auth, async (req: AuthRequest, res: Response) => {
	try {
		const userId = req.user?.id;
		if (!userId) {
			res.status(401).json({ message: 'Not authenticated' });
			return;
		}

		const { name, phone, address } = req.body;
		const updates: Record<string, string> = {};

		if (name) {
			updates.name = name;
		}
		if (phone) {
			updates.phone = phone;
		}
		if (address) {
			updates.address = address;
		}

		const user = await User.findByIdAndUpdate(userId, updates, {
			new: true,
			runValidators: true,
		}).select('-password');

		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: 'Failed to update profile' });
	}
});

export default router;
