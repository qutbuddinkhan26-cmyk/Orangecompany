"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, CheckCircle, Search } from "lucide-react";

interface Booking {
  _id: string;
  bookingNumber: string;
  bookingDate: string;
  timeSlot: string;
  status: string;
  finalAmount: number;
  specialInstructions?: string;
  serviceId: {
    name: string;
    thumbnail?: string;
    durationMinutes: number;
  };
  userId: {
    fullName: string;
    email: string;
    phone?: string;
    profilePhoto?: string;
  };
  addressId: {
    fullAddress: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
}

export default function ProviderBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const status = activeTab === "all" ? "" : `?status=${activeTab}`;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/provider/bookings${status}`,
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

  const handleAction = async (bookingId: string, action: "accept" | "reject" | "complete") => {
    try {
      setActionLoading(bookingId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/provider/bookings/${bookingId}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: action === "reject" ? JSON.stringify({ cancellationReason: "Provider rejected" }) : undefined,
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchBookings();
      }
    } catch (error) {
      console.error(`Error ${action} booking:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Accepted" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

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

  const filteredBookings = bookings.filter(booking => 
    booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.serviceId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
        <p className="text-gray-600">Manage your service bookings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking number, customer, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="p-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search" : "No bookings in this category"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{booking.serviceId?.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">#{booking.bookingNumber}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium mb-1">Customer Details</p>
                          <p className="font-semibold">{booking.userId?.fullName}</p>
                          {booking.userId?.email && <p className="text-gray-600">{booking.userId.email}</p>}
                          {booking.userId?.phone && (
                            <a href={`tel:${booking.userId.phone}`} className="text-primary hover:underline">
                              {booking.userId.phone}
                            </a>
                          )}
                        </div>

                        <div>
                          <p className="text-gray-600 font-medium mb-1">Service Details</p>
                          <p>📅 {new Date(booking.bookingDate).toLocaleDateString()}</p>
                          <p>🕒 {booking.timeSlot}</p>
                          <p>⏱️ {booking.serviceId?.durationMinutes} minutes</p>
                        </div>

                        <div className="md:col-span-2">
                          <p className="text-gray-600 font-medium mb-1">Service Address</p>
                          <p>{booking.addressId?.fullAddress}</p>
                          {booking.addressId?.landmark && <p className="text-gray-600">Landmark: {booking.addressId.landmark}</p>}
                          <p className="text-gray-600">
                            {booking.addressId?.city}, {booking.addressId?.state} - {booking.addressId?.pincode}
                          </p>
                        </div>

                        {booking.specialInstructions && (
                          <div className="md:col-span-2">
                            <p className="text-gray-600 font-medium mb-1">Special Instructions</p>
                            <p className="text-sm bg-gray-50 p-2 rounded">{booking.specialInstructions}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-lg font-bold">Amount: ₹{booking.finalAmount}</p>
                        <p className="text-xs text-gray-500">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex md:flex-col gap-2">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleAction(booking._id, "accept")}
                            disabled={actionLoading === booking._id}
                            className="flex-1 md:flex-none"
                            size="sm"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleAction(booking._id, "reject")}
                            disabled={actionLoading === booking._id}
                            className="flex-1 md:flex-none"
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {(booking.status === "confirmed" || booking.status === "in_progress") && (
                        <Button
                          onClick={() => handleAction(booking._id, "complete")}
                          disabled={actionLoading === booking._id}
                          className="flex-1 md:flex-none"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
