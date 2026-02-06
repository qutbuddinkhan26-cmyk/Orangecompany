import Link from "next/link";
import { Search, Star, Shield, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const categories = [
    { name: "Home Cleaning", icon: "🧹", services: "12+ services" },
    { name: "Beauty & Spa", icon: "💆", services: "25+ services" },
    { name: "Appliance Repair", icon: "🔧", services: "15+ services" },
    { name: "Painting", icon: "🎨", services: "8+ services" },
    { name: "Pest Control", icon: "🐛", services: "6+ services" },
    { name: "Plumbing", icon: "🚰", services: "10+ services" },
    { name: "Electrical", icon: "⚡", services: "12+ services" },
    { name: "Carpentry", icon: "🪚", services: "9+ services" },
  ];

  const featuredServices = [
    {
      id: 1,
      name: "Deep Home Cleaning",
      price: 999,
      rating: 4.8,
      reviews: 2534,
      duration: "3-4 hours",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    },
    {
      id: 2,
      name: "AC Service & Repair",
      price: 499,
      rating: 4.7,
      reviews: 1823,
      duration: "1-2 hours",
      image: "https://images.unsplash.com/photo-1631545806609-fa7e4ad5c2e0?w=400",
    },
    {
      id: 3,
      name: "Salon for Women",
      price: 799,
      rating: 4.9,
      reviews: 3421,
      duration: "2-3 hours",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Browse Services",
      description: "Choose from 100+ home services",
      icon: Search,
    },
    {
      step: 2,
      title: "Book Appointment",
      description: "Select date, time, and professional",
      icon: CheckCircle,
    },
    {
      step: 3,
      title: "Relax",
      description: "Let our verified experts handle it",
      icon: Star,
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Excellent service! The cleaning was thorough and professional.",
      service: "Home Cleaning",
    },
    {
      name: "Rahul Verma",
      rating: 5,
      comment: "Quick AC repair. Technician was skilled and courteous.",
      service: "AC Repair",
    },
    {
      name: "Anita Desai",
      rating: 5,
      comment: "Best salon experience at home. Highly recommended!",
      service: "Beauty Services",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              ServiceHub
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/services" className="text-sm hover:text-primary">
                Services
              </Link>
              <Link href="/about" className="text-sm hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-sm hover:text-primary">
                Contact
              </Link>
              <Link
                href="/provider/register"
                className="text-sm hover:text-primary"
              >
                Become a Professional
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Home Services at Your Doorstep
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Professional & verified service providers for all your home needs
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 bg-white p-2 rounded-lg shadow-lg">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search for services..."
                    className="pl-10 border-0"
                  />
                </div>
                <Button size="lg">Search</Button>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm">On-Time Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-sm">4.8★ Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/services?category=${category.name}`}
                className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow text-center group"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1 group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.services}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">{service.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({service.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">₹{service.price}</span>
                      <p className="text-xs text-gray-500">{service.duration}</p>
                    </div>
                    <Button size="sm">Book Now</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-sm font-semibold text-primary mb-2">
                  Step {item.step}
                </div>
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-amber-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.comment}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-white rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose ServiceHub?</h2>
            <div className="grid md:grid-cols-4 gap-8 mt-8">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <p className="text-purple-100">Verified Professionals</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5M+</div>
                <p className="text-purple-100">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100+</div>
                <p className="text-purple-100">Services Available</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.8★</div>
                <p className="text-purple-100">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">ServiceHub</h3>
              <p className="text-sm">
                Your trusted partner for all home services. Professional,
                verified, and reliable.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Partners</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/provider/register" className="hover:text-white">
                    Become a Professional
                  </Link>
                </li>
                <li>
                  <Link href="/provider/login" className="hover:text-white">
                    Professional Login
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="hover:text-white">
                    Partner with Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} ServiceHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
