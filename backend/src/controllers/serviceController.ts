import { Request, Response } from 'express';
import Service from '../models/Service';
import Category from '../models/Category';

export const getAllServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, sort, minPrice, maxPrice, featured } = req.query;
    
    let query: any = { isActive: true };

    // Filter by category
    if (category) {
      const cat = await Category.findOne({ slug: category as string });
      if (cat) {
        query.categoryId = cat._id;
      }
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { basePrice: 1 };
    if (sort === 'price_desc') sortOption = { basePrice: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popular') sortOption = { totalBookings: -1 };

    const services = await Service.find(query)
      .populate('categoryId', 'name slug')
      .sort(sortOption)
      .limit(50);

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error: any) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id)
      .populate('categoryId', 'name slug icon');

    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error: any) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const createService = async (req: any, res: Response): Promise<void> => {
  try {
    // Only admin can create services
    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const service = new Service(req.body);
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service,
    });
  } catch (error: any) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
