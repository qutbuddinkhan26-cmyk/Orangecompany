import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Category from '../models/Category';
import Service from '../models/Service';
import { connectDatabase } from '../config/database';

dotenv.config();

const categories = [
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'Professional home cleaning services',
    icon: '🧹',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'Beauty & Spa',
    slug: 'beauty-spa',
    description: 'Beauty and spa services at home',
    icon: '💆',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    description: 'Repair and maintenance of home appliances',
    icon: '🔧',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'Painting',
    slug: 'painting',
    description: 'Professional painting services',
    icon: '🎨',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'Pest Control',
    slug: 'pest-control',
    description: 'Effective pest control solutions',
    icon: '🐛',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Expert plumbing services',
    icon: '🚰',
    displayOrder: 6,
    isActive: true,
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    description: 'Electrical repair and installation',
    icon: '⚡',
    displayOrder: 7,
    isActive: true,
  },
  {
    name: 'Carpentry',
    slug: 'carpentry',
    description: 'Furniture and carpentry services',
    icon: '🪚',
    displayOrder: 8,
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDatabase();
    
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@servicehub.com',
      password: adminPassword,
      fullName: 'Admin User',
      role: 'admin',
      isVerified: true,
      isActive: true,
    });
    console.log('✅ Admin created:', admin.email);
    
    console.log('👥 Creating sample users...');
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await User.create({
      email: 'customer@example.com',
      password: customerPassword,
      fullName: 'John Doe',
      phone: '+1234567890',
      role: 'customer',
      isVerified: true,
      isActive: true,
    });
    console.log('✅ Customer created:', customer.email);
    
    const providerPassword = await bcrypt.hash('provider123', 10);
    const provider = await User.create({
      email: 'provider@example.com',
      password: providerPassword,
      fullName: 'Service Provider',
      phone: '+0987654321',
      role: 'provider',
      isVerified: true,
      isActive: true,
    });
    console.log('✅ Provider created:', provider.email);
    
    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categories created`);
    
    console.log('🛠️  Creating services...');
    const services = [
      {
        name: 'Deep Home Cleaning',
        slug: 'deep-home-cleaning',
        description: 'Comprehensive deep cleaning of your entire home including all rooms, bathrooms, kitchen, and living areas. Our professional cleaners use eco-friendly products.',
        categoryId: createdCategories[0]._id,
        basePrice: 999,
        discountPercentage: 10,
        durationMinutes: 180,
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        whatIncluded: [
          'Dusting all surfaces',
          'Vacuuming and mopping floors',
          'Bathroom deep cleaning',
          'Kitchen cleaning',
          'Window cleaning (interior)',
        ],
        whatExcluded: [
          'Exterior window cleaning',
          'Carpet shampooing',
          'Curtain cleaning',
        ],
        isActive: true,
        isFeatured: true,
        rating: 4.8,
        totalBookings: 2534,
      },
      {
        name: 'AC Service & Repair',
        slug: 'ac-service-repair',
        description: 'Professional AC servicing and repair. Includes gas filling, filter cleaning, and performance check.',
        categoryId: createdCategories[2]._id,
        basePrice: 499,
        discountPercentage: 0,
        durationMinutes: 90,
        images: ['https://images.unsplash.com/photo-1631545806609-fa7e4ad5c2e0?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1631545806609-fa7e4ad5c2e0?w=400',
        whatIncluded: [
          'Filter cleaning',
          'Gas check and filling',
          'Condenser cleaning',
          'Performance check',
          '30-day warranty',
        ],
        whatExcluded: [
          'Major part replacement',
          'Compressor repair',
        ],
        isActive: true,
        isFeatured: true,
        rating: 4.7,
        totalBookings: 1823,
      },
      {
        name: 'Salon for Women at Home',
        slug: 'salon-women-home',
        description: 'Professional beauty services at your home. Includes haircut, facial, manicure, and pedicure.',
        categoryId: createdCategories[1]._id,
        basePrice: 799,
        discountPercentage: 15,
        durationMinutes: 150,
        images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
        whatIncluded: [
          'Haircut and styling',
          'Facial treatment',
          'Manicure',
          'Pedicure',
          'Premium products used',
        ],
        whatExcluded: [
          'Hair coloring',
          'Advanced spa treatments',
        ],
        isActive: true,
        isFeatured: true,
        rating: 4.9,
        totalBookings: 3421,
      },
      {
        name: 'Wall Painting (1 Room)',
        slug: 'wall-painting-room',
        description: 'Professional painting service for one room. Includes preparation, primer, and two coats of paint.',
        categoryId: createdCategories[3]._id,
        basePrice: 2999,
        discountPercentage: 5,
        durationMinutes: 480,
        images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
        whatIncluded: [
          'Surface preparation',
          'Primer application',
          'Two coats of paint',
          'Touch-up work',
          'Clean-up after work',
        ],
        whatExcluded: [
          'Furniture moving',
          'Wall repair',
          'Exterior painting',
        ],
        isActive: true,
        isFeatured: false,
        rating: 4.6,
        totalBookings: 856,
      },
      {
        name: 'General Pest Control',
        slug: 'general-pest-control',
        description: 'Effective pest control treatment for cockroaches, ants, and other common pests.',
        categoryId: createdCategories[4]._id,
        basePrice: 699,
        discountPercentage: 0,
        durationMinutes: 60,
        images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
        whatIncluded: [
          'Spray treatment',
          'Gel application',
          'Common areas coverage',
          'Safe for pets and children',
          '30-day warranty',
        ],
        whatExcluded: [
          'Termite treatment',
          'Bed bug treatment',
        ],
        isActive: true,
        isFeatured: false,
        rating: 4.5,
        totalBookings: 1245,
      },
      {
        name: 'Plumbing Service',
        slug: 'plumbing-service',
        description: 'Expert plumbing services for leaks, installations, and repairs.',
        categoryId: createdCategories[5]._id,
        basePrice: 399,
        discountPercentage: 0,
        durationMinutes: 60,
        images: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
        whatIncluded: [
          'Leak detection',
          'Pipe repair',
          'Tap installation',
          'Drain cleaning',
          '7-day warranty',
        ],
        whatExcluded: [
          'Major pipe replacement',
          'Bathroom renovation',
        ],
        isActive: true,
        isFeatured: false,
        rating: 4.6,
        totalBookings: 1567,
      },
      {
        name: 'Electrical Wiring & Repair',
        slug: 'electrical-wiring-repair',
        description: 'Safe and reliable electrical services including wiring, switch installation, and repairs.',
        categoryId: createdCategories[6]._id,
        basePrice: 449,
        discountPercentage: 0,
        durationMinutes: 90,
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
        whatIncluded: [
          'Switch/socket installation',
          'Wiring repair',
          'Light fixture installation',
          'Safety check',
          '15-day warranty',
        ],
        whatExcluded: [
          'Complete rewiring',
          'Main board upgrade',
        ],
        isActive: true,
        isFeatured: false,
        rating: 4.7,
        totalBookings: 982,
      },
      {
        name: 'Furniture Assembly',
        slug: 'furniture-assembly',
        description: 'Professional furniture assembly and installation service.',
        categoryId: createdCategories[7]._id,
        basePrice: 599,
        discountPercentage: 10,
        durationMinutes: 120,
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
        whatIncluded: [
          'Furniture assembly',
          'Hardware installation',
          'Leveling and adjustment',
          'Clean-up',
          '7-day warranty',
        ],
        whatExcluded: [
          'Furniture repair',
          'Custom modifications',
        ],
        isActive: true,
        isFeatured: false,
        rating: 4.8,
        totalBookings: 756,
      },
    ];
    
    const createdServices = await Service.insertMany(services);
    console.log(`✅ ${createdServices.length} services created`);
    
    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📝 Sample Credentials:');
    console.log('Admin: admin@servicehub.com / admin123');
    console.log('Customer: customer@example.com / customer123');
    console.log('Provider: provider@example.com / provider123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
