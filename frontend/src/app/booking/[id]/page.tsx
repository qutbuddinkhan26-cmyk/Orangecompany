"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, isAuthenticated, formatPrice, formatDate } from "@/lib/api";

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const response = await api.getBookingById(bookingId);
      setBooking(response.booking);
    } catch (err) {
      console.error("Error loading booking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Booking not found</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
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
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-xl p-8 shadow-lg text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your booking has been successfully created. We'll send you a
              confirmation shortly.
            </p>
            <div className="inline-block bg-gray-100 px-6 py-3 rounded-lg">
              <span className="text-sm text-gray-600">Booking Number</span>
              <p className="text-xl font-bold">{booking.bookingNumber}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">
                  {booking.serviceId?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">
                  {formatDate(new Date(booking.bookingDate))}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Time Slot</span>
                <span className="font-medium">{booking.timeSlot}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Address</span>
                <span className="font-medium text-right">
                  {booking.addressId?.fullAddress || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Status</span>
                <span className="font-medium capitalize">{booking.status}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary">
                  {formatPrice(booking.finalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full" size="lg">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/services" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                Browse More Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
