"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";

type Booking = {
  _id: string;
  status?: string;
  date?: string;
  time?: string;
  address?: string;
  service?: {
    name?: string;
  };
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    let isMounted = true;
    const loadBookings = async () => {
      try {
        const data = (await fetchApi("/bookings", { method: "GET" })) as Booking[];
        if (isMounted) {
          setBookings(data);
        }
      } catch (err) {
        const message =
          typeof err === "object" && err && "message" in err
            ? String((err as { message?: string }).message)
            : "Failed to load bookings.";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated) {
      loadBookings();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter((booking) =>
      ["pending", "accepted"].includes(booking.status || "")
    ).length;
    const completed = bookings.filter((booking) => booking.status === "completed")
      .length;
    return { total, active, completed };
  }, [bookings]);

  const welcomeName = user?.name || user?.fullName || "there";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Welcome back, {welcomeName}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track your bookings and keep tabs on upcoming services.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            Book a new service
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Total bookings", value: stats.total },
            { label: "Active bookings", value: stats.active },
            { label: "Completed bookings", value: stats.completed },
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

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent bookings</h2>
            <span className="text-sm text-slate-500">
              {bookings.length} total
            </span>
          </div>

          {loading && (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-16 w-full animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-6 text-center text-sm text-orange-700">
              No bookings yet. Start by booking your first service.
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="mt-6 space-y-4">
              {bookings.map((booking) => {
                const status = booking.status || "pending";
                return (
                  <div
                    key={booking._id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {booking.service?.name || "Service booking"}
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
