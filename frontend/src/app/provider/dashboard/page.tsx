"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";

type Service = {
  _id: string;
  name: string;
  basePrice?: number;
  isActive?: boolean;
  provider?: { _id?: string } | string;
};

type Booking = {
  _id: string;
  status?: string;
  date?: string;
  time?: string;
  service?: {
    _id?: string;
    name?: string;
    basePrice?: number;
    provider?: { _id?: string } | string;
  };
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const providerId = (user as { id?: string; _id?: string } | null)?.id ||
    (user as { id?: string; _id?: string } | null)?._id ||
    "";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!authLoading && isAuthenticated && user?.role !== "provider") {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router, user?.role]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [servicesData, bookingsData] = await Promise.all([
          fetchApi("/services", { method: "GET" }),
          fetchApi("/bookings", { method: "GET" }),
        ]);

        if (isMounted) {
          setServices(servicesData as Service[]);
          setBookings(bookingsData as Booking[]);
        }
      } catch (err) {
        const message =
          typeof err === "object" && err && "message" in err
            ? String((err as { message?: string }).message)
            : "Failed to load provider dashboard.";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated && user?.role === "provider") {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.role]);

  const providerServices = useMemo(() => {
    if (!providerId) {
      return services;
    }
    return services.filter((service) => {
      const ownerId =
        typeof service.provider === "string"
          ? service.provider
          : service.provider?._id;
      return ownerId ? String(ownerId) === String(providerId) : true;
    });
  }, [providerId, services]);

  const incomingBookings = useMemo(() => {
    if (!providerId) {
      return bookings;
    }
    return bookings.filter((booking) => {
      const ownerId =
        typeof booking.service?.provider === "string"
          ? booking.service?.provider
          : booking.service?.provider?._id;
      return ownerId ? String(ownerId) === String(providerId) : true;
    });
  }, [bookings, providerId]);

  const stats = useMemo(() => {
    const totalServices = providerServices.length;
    const activeBookings = incomingBookings.filter((booking) =>
      ["pending", "accepted"].includes(booking.status || "")
    ).length;
    const revenue = incomingBookings
      .filter((booking) => booking.status === "completed")
      .reduce((total, booking) => total + (booking.service?.basePrice || 0), 0);

    return { totalServices, activeBookings, revenue };
  }, [incomingBookings, providerServices]);

  const handleUpdateBooking = async (bookingId: string, status: string) => {
    setActionLoading(bookingId);
    try {
      const updated = (await fetchApi(`/bookings/${bookingId}/status`, {
        method: "PUT",
        body: { status },
      })) as Booking;

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, ...updated } : booking
        )
      );
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message?: string }).message)
          : "Failed to update booking.";
      setError(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    setActionLoading(serviceId);
    try {
      await fetchApi(`/services/${serviceId}`, { method: "DELETE" });
      setServices((prev) => prev.filter((service) => service._id !== serviceId));
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message?: string }).message)
          : "Failed to delete service.";
      setError(message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Provider Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Manage your services and bookings
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Keep an eye on incoming requests and grow your business in Dubai.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            View marketplace
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Total services", value: stats.totalServices },
            { label: "Active bookings", value: stats.activeBookings },
            { label: "Revenue (AED)", value: stats.revenue },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-orange-100 bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {card.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Your services</h2>
              <span className="text-sm text-slate-500">
                {providerServices.length} listed
              </span>
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`service-skeleton-${index}`}
                    className="h-14 w-full animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : providerServices.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-6 text-sm text-orange-700">
                No services yet. Add your first service to start receiving bookings.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {providerServices.map((service) => (
                  <div
                    key={service._id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {service.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        AED {service.basePrice ?? 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/provider/services/${service._id}`}
                        className="rounded-lg border border-orange-200 px-3 py-1 text-xs font-semibold text-orange-600 transition hover:border-orange-300"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(service._id)}
                        disabled={actionLoading === service._id}
                        className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Incoming requests
              </h2>
              <span className="text-sm text-slate-500">
                {incomingBookings.length} total
              </span>
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={`booking-skeleton-${index}`}
                    className="h-20 w-full animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : incomingBookings.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-6 text-sm text-orange-700">
                No booking requests yet.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {incomingBookings.map((booking) => {
                  const status = booking.status || "pending";
                  return (
                    <div
                      key={booking._id}
                      className="space-y-3 rounded-xl border border-slate-200 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {booking.service?.name || "Service request"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {booking.date || "Date pending"} {booking.time ? `at ${booking.time}` : ""}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyles[status] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateBooking(booking._id, "accepted")}
                          disabled={actionLoading === booking._id}
                          className="flex-1 rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 transition hover:border-green-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateBooking(booking._id, "rejected")}
                          disabled={actionLoading === booking._id}
                          className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
