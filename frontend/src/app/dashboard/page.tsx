"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  Settings,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/login";
      return;
    }
    setUser(JSON.parse(userData));

    // Fetch bookings
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary">
              ServiceHub
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/services" className="text-sm hover:text-primary">
                Browse Services
              </Link>
              <Link href="/dashboard" className="text-sm text-primary font-medium">
                Dashboard
              </Link>
            </nav>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.fullName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-sm text-gray-500 mb-1">Member since</div>
                <div className="font-medium">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-xl shadow-md p-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium mb-2"
              >
                <Calendar className="h-5 w-5" />
                My Bookings
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
              <Link
                href="/dashboard/addresses"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
              >
                <MapPin className="h-5 w-5" />
                Addresses
              </Link>
              <Link
                href="/dashboard/payments"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
              >
                <CreditCard className="h-5 w-5" />
                Payments
              </Link>
              <Link
                href="/dashboard/notifications"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
              >
                <Bell className="h-5 w-5" />
                Notifications
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.fullName}!</h1>
              <p className="text-gray-600">Manage your bookings and profile</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-sm text-gray-500 mb-1">Total Bookings</div>
                <div className="text-3xl font-bold">{bookings.length}</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-sm text-gray-500 mb-1">Upcoming</div>
                <div className="text-3xl font-bold">
                  {bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-sm text-gray-500 mb-1">Completed</div>
                <div className="text-3xl font-bold">
                  {bookings.filter((b) => b.status === "completed").length}
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">My Bookings</h2>
                <Link href="/services">
                  <Button size="sm">Book New Service</Button>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start by booking your first service
                  </p>
                  <Link href="/services">
                    <Button>Browse Services</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">
                              {booking.serviceId?.name || "Service"}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                booking.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : booking.status === "confirmed"
                                  ? "bg-blue-100 text-blue-700"
                                  : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              📅 {new Date(booking.bookingDate).toLocaleDateString()} at{" "}
                              {booking.timeSlot}
                            </p>
                            <p>
                              📍 {booking.addressId?.fullAddress || "Address not available"}
                            </p>
                            <p className="font-medium mt-2">
                              Amount: ₹{booking.finalAmount}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {booking.status === "pending" && (
                            <Button variant="destructive" size="sm">
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
