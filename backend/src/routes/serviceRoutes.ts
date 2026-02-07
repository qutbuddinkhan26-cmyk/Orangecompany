import express, { Request, Response } from 'express';
import Service from '../models/Service';
import { auth, AuthRequest } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.get('/', apiLimiter, async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    const query: Record<string, unknown> = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(query)
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

router.get('/:id', apiLimiter, async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name email')
      .populate('category');

    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch service' });
  }
});

router.post('/', auth, createLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const providerId = req.user?.id;
    if (!providerId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const service = await Service.create({ ...req.body, provider: providerId });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service' });
  }
});

router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const providerId = req.user?.id;
    if (!providerId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    if (String(service.provider) !== String(providerId)) {
      res.status(403).json({ message: 'Not authorized to update this service' });
      return;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update service' });
  }
});

router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const providerId = req.user?.id;
    if (!providerId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    if (String(service.provider) !== String(providerId)) {
      res.status(403).json({ message: 'Not authorized to delete this service' });
      return;
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service' });
  }
});

export default router;
