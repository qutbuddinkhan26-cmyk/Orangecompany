"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Star, Clock } from "lucide-react";

interface Stats {
  todayEarnings: number;
  totalBookings: number;
  averageRating: number;
  pendingRequests: number;
  totalReviews: number;
}

interface Booking {
  _id: string;
  bookingNumber: string;
  bookingDate: string;
  timeSlot: string;
  status: string;
  finalAmount: number;
  serviceId: {
    name: string;
    thumbnail?: string;
  };
  userId: {
    fullName: string;
    phone?: string;
  };
  addressId: {
    fullAddress: string;
    city: string;
  };
}

interface Review {
  _id: string;
  rating: number;
  review: string;
  createdAt: string;
  userId: {
    fullName: string;
    profilePhoto?: string;
  };
  serviceId: {
    name: string;
  };
}

export default function ProviderDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsRes, bookingsRes, reviewsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/provider/stats`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/provider/bookings?status=confirmed`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/provider/reviews`, { headers }),
      ]);

      const [statsData, bookingsData, reviewsData] = await Promise.all([
        statsRes.json(),
        bookingsRes.json(),
        reviewsRes.json(),
      ]);

      if (statsData.success) {
        setStats(statsData.stats);
      }

      if (bookingsData.success) {
        const upcoming = bookingsData.bookings
          .filter((b: Booking) => new Date(b.bookingDate) >= new Date())
          .slice(0, 5);
        setUpcomingBookings(upcoming);
      }

      if (reviewsData.success) {
        setRecentReviews(reviewsData.reviews.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-amber-500 text-amber-500"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">Manage your bookings and track earnings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Today's Earnings</div>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold">₹{stats?.todayEarnings || 0}</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Total Bookings</div>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold">{stats?.totalBookings || 0}</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Average Rating</div>
            <Star className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold">{stats?.averageRating || 0}</div>
          <div className="text-xs text-gray-500 mt-1">
            from {stats?.totalReviews || 0} reviews
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Pending Requests</div>
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold">{stats?.pendingRequests || 0}</div>
          {stats?.pendingRequests ? (
            <Link href="/provider/bookings?status=pending">
              <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1">
                View requests →
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Upcoming Bookings</h2>
          <Link href="/provider/bookings">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{booking.serviceId?.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>👤 {booking.userId?.fullName}</p>
                      <p>📅 {new Date(booking.bookingDate).toLocaleDateString()} at {booking.timeSlot}</p>
                      <p>📍 {booking.addressId?.fullAddress}</p>
                      <p className="font-medium mt-2">₹{booking.finalAmount}</p>
                    </div>
                  </div>
                  <Link href={`/provider/bookings?id=${booking._id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Reviews</h2>
          <Link href="/provider/reviews">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {recentReviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">
                      {review.userId?.fullName?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{review.userId?.fullName}</h4>
                        <p className="text-xs text-gray-500">{review.serviceId?.name}</p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-gray-700">{review.review}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
