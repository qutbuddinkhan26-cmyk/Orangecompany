import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Category from '../models/Category';
import Service from '../models/Service';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/servicehub';

const categories = [
  {
    name: 'AC Repair',
    slug: 'ac-repair',
    description: 'AC diagnostics, servicing, and repair for Dubai apartments.',
    icon: '❄️',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Leak fixes, pipe replacements, and bathroom maintenance.',
    icon: '🚰',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    description: 'Safe electrical repairs, lighting, and switch upgrades.',
    icon: '⚡',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'Cleaning',
    slug: 'cleaning',
    description: 'Deep cleaning services for villas and apartments.',
    icon: '🧼',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'Painting',
    slug: 'painting',
    description: 'Interior painting with premium, low-odor paint.',
    icon: '🎨',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'Carpentry',
    slug: 'carpentry',
    description: 'Custom carpentry, fixtures, and furniture assembly.',
    icon: '🪚',
    displayOrder: 6,
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Service.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 12);

    const admin = await User.create({
      email: 'admin@servicehub.com',
      password: hashedPassword,
      fullName: 'ServiceHub Admin',
      role: 'admin',
      isVerified: true,
      isActive: true,
    });

    const provider = await User.create({
      email: 'provider@servicehub.com',
      password: hashedPassword,
      fullName: 'Dubai Service Pro',
      phone: '+971 50 123 4567',
      role: 'provider',
      isVerified: true,
      isActive: true,
    });

    const createdCategories = await Category.insertMany(categories);
    const categoryMap = createdCategories.reduce<Record<string, mongoose.Types.ObjectId>>(
      (acc, category) => {
        acc[category.slug] = category._id;
        return acc;
      },
      {}
    );

    const services = [
      {
        name: 'AC Cooling Tune-Up',
        slug: 'ac-cooling-tune-up',
        description:
          'Keep your home cool with a full AC tune-up, filter cleaning, and gas top-up in Dubai heat.',
        categoryId: categoryMap['ac-repair'],
        provider: provider._id,
        basePrice: 350,
        discountPercentage: 5,
        durationMinutes: 90,
        images: ['https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400',
        whatIncluded: ['Filter cleaning', 'Gas top-up', 'Performance test'],
        whatExcluded: ['Compressor replacement', 'Major part upgrades'],
        isActive: true,
        isFeatured: true,
        rating: 4.8,
        totalBookings: 420,
      },
      {
        name: 'Rapid Plumbing Fix',
        slug: 'rapid-plumbing-fix',
        description:
          'Same-day plumbing support for leaks, clogs, and fixture replacements in Dubai Marina.',
        categoryId: categoryMap.plumbing,
        provider: provider._id,
        basePrice: 260,
        discountPercentage: 0,
        durationMinutes: 60,
        images: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
        whatIncluded: ['Leak inspection', 'Basic pipe repair', 'Drain clearing'],
        whatExcluded: ['Full bathroom renovations', 'Hidden pipe rerouting'],
        isActive: true,
        isFeatured: false,
        rating: 4.6,
        totalBookings: 285,
      },
      {
        name: 'Electrical Safety Upgrade',
        slug: 'electrical-safety-upgrade',
        description:
          'Upgrade switches, sockets, and lighting with certified electricians across Dubai.',
        categoryId: categoryMap.electrical,
        provider: provider._id,
        basePrice: 320,
        discountPercentage: 0,
        durationMinutes: 75,
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
        whatIncluded: ['Socket replacement', 'Lighting checks', 'Safety inspection'],
        whatExcluded: ['Complete rewiring', 'Fuse board replacement'],
        isActive: true,
        isFeatured: false,
        rating: 4.7,
        totalBookings: 210,
      },
      {
        name: 'Deep Home Cleaning',
        slug: 'deep-home-cleaning-dubai',
        description:
          'Premium deep cleaning for apartments and villas with eco-friendly products.',
        categoryId: categoryMap.cleaning,
        provider: provider._id,
        basePrice: 220,
        discountPercentage: 10,
        durationMinutes: 120,
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        whatIncluded: ['Kitchen detailing', 'Bathroom sanitization', 'Floor polishing'],
        whatExcluded: ['Exterior window cleaning', 'Carpet shampooing'],
        isActive: true,
        isFeatured: true,
        rating: 4.9,
        totalBookings: 530,
      },
      {
        name: 'Interior Painting Package',
        slug: 'interior-painting-package',
        description:
          'Freshen up your Dubai home with premium low-odor paint for one standard room.',
        categoryId: categoryMap.painting,
        provider: provider._id,
        basePrice: 1200,
        discountPercentage: 0,
        durationMinutes: 360,
        images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
        whatIncluded: ['Surface prep', 'Primer coat', 'Two paint coats'],
        whatExcluded: ['Ceiling repaint', 'Major wall repairs'],
        isActive: true,
        isFeatured: false,
        rating: 4.5,
        totalBookings: 95,
      },
      {
        name: 'Custom Carpentry & Assembly',
        slug: 'custom-carpentry-assembly',
        description:
          'Wardrobe fixes, shelving, and furniture assembly tailored for Dubai homes.',
        categoryId: categoryMap.carpentry,
        provider: provider._id,
        basePrice: 450,
        discountPercentage: 0,
        durationMinutes: 120,
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'],
        thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
        whatIncluded: ['Furniture assembly', 'Shelving install', 'Hardware alignment'],
        whatExcluded: ['Custom cabinetry builds', 'Structural changes'],
        isActive: true,
        isFeatured: false,
        rating: 4.6,
        totalBookings: 140,
      },
    ];

    await Service.insertMany(services);

    console.log('✨ Database seeding completed successfully');
    console.log('Admin: admin@servicehub.com / password123');
    console.log('Provider: provider@servicehub.com / password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
