"use client";

import { useState, useEffect } from "react";
import { DollarSign, Users, Calendar, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Stats {
  users: number;
  bookings: number;
  services: number;
  revenue: number;
}

interface Booking {
  _id: string;
  bookingNumber: string;
  bookingDate: string;
  status: string;
  finalAmount: number;
  serviceId: {
    name: string;
  };
  userId: {
    fullName: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
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

      const [statsRes, bookingsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/bookings?limit=5`, { headers }),
      ]);

      const [statsData, bookingsData] = await Promise.all([
        statsRes.json(),
        bookingsRes.json(),
      ]);

      if (statsData.success) {
        setStats(statsData.stats);
      }

      if (bookingsData.success) {
        setRecentBookings(bookingsData.bookings);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Total Users</div>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold">{stats?.users || 0}</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Total Bookings</div>
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold">{stats?.bookings || 0}</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold">₹{stats?.revenue || 0}</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Total Services</div>
            <Briefcase className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold">{stats?.services || 0}</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>

        {recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{booking.bookingNumber}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Service: {booking.serviceId?.name}</p>
                      <p>Customer: {booking.userId?.fullName}</p>
                      <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                      <p className="font-medium mt-2">₹{booking.finalAmount}</p>
                    </div>
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
