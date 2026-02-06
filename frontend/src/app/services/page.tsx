"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Filter, ArrowLeft } from "lucide-react";

interface Service {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  discountPercentage: number;
  durationMinutes: number;
  rating: number;
  totalBookings: number;
  thumbnail?: string;
  categoryId?: {
    name: string;
    slug: string;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    fetchServices();
  }, [sortBy]);

  const fetchServices = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services?sort=${sortBy}`
      );
      const data = await response.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateFinalPrice = (service: Service) => {
    const discount = (service.basePrice * service.discountPercentage) / 100;
    return service.basePrice - discount;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              ServiceHub
            </Link>
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
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-4">All Services</h1>
          <p className="text-gray-600 mb-6">
            Browse our complete range of professional home services
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="flex gap-2 bg-white p-2 rounded-lg shadow-md">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-0"
                />
              </div>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Services */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
            <p className="text-sm text-gray-600">
              {filteredServices.length} services found
            </p>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
                >
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No services found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service._id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    {service.thumbnail ? (
                      <img
                        src={service.thumbnail}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="text-6xl">🛠️</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">
                          {service.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({service.totalBookings} bookings)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {service.discountPercentage > 0 ? (
                          <>
                            <span className="text-2xl font-bold">
                              ₹{calculateFinalPrice(service)}
                            </span>
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ₹{service.basePrice}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold">
                            ₹{service.basePrice}
                          </span>
                        )}
                        <p className="text-xs text-gray-500">
                          {service.durationMinutes} mins
                        </p>
                      </div>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
