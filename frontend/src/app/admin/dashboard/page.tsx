"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!authLoading && isAuthenticated && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router, user?.role]);

  const stats = [
    { label: "Total users", value: "12,480" },
    { label: "Services", value: "1,120" },
    { label: "Bookings", value: "9,842" },
    { label: "Revenue (AED)", value: "1.8M" },
  ];

  const recentUsers = [
    { name: "Ahmed Khalid", email: "ahmed@servicehub.ae", role: "customer" },
    { name: "Noura Saeed", email: "noura@servicehub.ae", role: "provider" },
    { name: "Jonas Lee", email: "jonas@servicehub.ae", role: "customer" },
  ];

  const recentBookings = [
    { id: "SH-2041", service: "Deep Home Cleaning", customer: "Aisha M.", amount: 320, status: "completed" },
    { id: "SH-2040", service: "AC Cooling Tune-Up", customer: "Daniel R.", amount: 350, status: "pending" },
    { id: "SH-2039", service: "Electrical Safety Upgrade", customer: "Fatima H.", amount: 320, status: "accepted" },
  ];

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Admin dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              ServiceHub overview
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track platform health and manage operations across Dubai.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/services"
              className="rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600"
            >
              View services
            </Link>
            <button
              type="button"
              className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Create report
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-orange-100 bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Recent users</h2>
              <span className="text-sm text-slate-500">Last 24h</span>
            </div>
            <div className="mt-6 space-y-4">
              {recentUsers.map((userItem) => (
                <div
                  key={userItem.email}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {userItem.name}
                    </p>
                    <p className="text-xs text-slate-500">{userItem.email}</p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {userItem.role}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Recent bookings</h2>
              <span className="text-sm text-slate-500">Last 12h</span>
            </div>
            <div className="mt-6 space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {booking.service}
                    </p>
                    <p className="text-xs text-slate-500">
                      {booking.customer} • {booking.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-orange-600">
                      AED {booking.amount}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { label: "Approve providers", description: "Review new provider signups" },
              { label: "Monitor cancellations", description: "Track cancellation reasons" },
              { label: "Send platform update", description: "Notify users of changes" },
            ].map((action) => (
              <div
                key={action.label}
                className="rounded-2xl border border-orange-100 bg-orange-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {action.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
