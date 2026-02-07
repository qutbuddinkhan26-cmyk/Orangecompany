"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createBooking, getServiceById } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Service = {
  _id: string;
  name: string;
  basePrice?: number;
  category?: { name?: string };
  categoryId?: { name?: string } | string;
};

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const getCategoryName = (service: Service | null) => {
  if (!service) {
    return "";
  }
  if (service.category?.name) {
    return service.category.name;
  }
  if (typeof service.categoryId === "object" && service.categoryId?.name) {
    return service.categoryId.name;
  }
  return "Other";
};

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const serviceId = useMemo(
    () => searchParams.get("serviceId") || searchParams.get("service") || "",
    [searchParams]
  );

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/login?redirect=/booking?serviceId=${serviceId}`);
    }
  }, [authLoading, isAuthenticated, router, serviceId]);

  useEffect(() => {
    let isMounted = true;
    const fetchService = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      try {
        const data = (await getServiceById(serviceId)) as Service;
        if (isMounted) {
          setService(data);
        }
      } catch (err) {
        const message =
          typeof err === "object" && err && "message" in err
            ? String((err as { message?: string }).message)
            : "Failed to load service.";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchService();
    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!serviceId) {
      setError("Service ID is missing.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const address = `${street}, ${area}, ${city}`.trim();
      const response = (await createBooking({
        serviceId,
        date,
        time,
        address,
        notes,
      })) as { _id?: string };

      setConfirmationId(response?._id || `SH-${Date.now().toString().slice(-6)}`);
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message?: string }).message)
          : "Failed to create booking.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmationId) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
            Booking confirmed
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            You are all set
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your booking for <span className="font-semibold">{service?.name}</span> is confirmed.
          </p>
          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
            Confirmation ID: {confirmationId}
          </div>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            View my bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Booking
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Book your service
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Choose a time and tell us where to send your ServiceHub pro.
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-orange-600"
          >
            Back to services
          </Link>
        </div>

        {loading && (
          <div className="mt-8 space-y-4">
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-80 w-full animate-pulse rounded-2xl bg-slate-200" />
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-orange-100 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Service
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {service?.name || "Selected service"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {getCategoryName(service)}
                  </p>
                </div>
                <p className="text-xl font-semibold text-orange-600">
                  AED {service?.basePrice ?? 0}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="date">
                    Select date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="time">
                    Select time
                  </label>
                  <select
                    id="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  >
                    <option value="">Choose a slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="street">
                    Street
                  </label>
                  <input
                    id="street"
                    type="text"
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                    placeholder="Building, street"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="area">
                    Area
                  </label>
                  <input
                    id="area"
                    type="text"
                    value={area}
                    onChange={(event) => setArea(event.target.value)}
                    placeholder="JLT, Marina, Downtown"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Dubai"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="notes">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Share any special instructions"
                  className="min-h-[110px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Booking..." : "Confirm booking"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
