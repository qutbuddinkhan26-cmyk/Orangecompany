"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getServiceById } from "@/lib/api";

type Provider = {
  name?: string;
};

type Service = {
  _id: string;
  name: string;
  description?: string;
  basePrice?: number;
  rating?: number;
  thumbnail?: string;
  images?: string[];
  category?: { name?: string };
  categoryId?: { name?: string } | string;
  provider?: Provider;
};

const getCategoryName = (service: Service) => {
  if (service.category?.name) {
    return service.category.name;
  }
  if (typeof service.categoryId === "object" && service.categoryId?.name) {
    return service.categoryId.name;
  }
  return "Other";
};

const getImageUrl = (service: Service) =>
  service.thumbnail || service.images?.[0] || "";

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = String(params.id || "");
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadService = async () => {
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

    loadService();
    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600"
        >
          <span className="text-lg">←</span>
          Back to services
        </Link>

        {loading && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="h-72 w-full animate-pulse rounded-3xl bg-slate-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="space-y-4">
              <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-12 w-full animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && service && (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="h-72 w-full bg-slate-100">
                {getImageUrl(service) ? (
                  <img
                    src={getImageUrl(service)}
                    alt={service.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                    Image coming soon
                  </div>
                )}
              </div>
              <div className="space-y-4 p-6">
                <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                  {getCategoryName(service)}
                </span>
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900">
                    {service.name}
                  </h1>
                  <p className="mt-3 text-sm text-slate-500">
                    {service.description ||
                      "Detailed service information will be available soon."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Service details
                </p>
                <p className="text-3xl font-semibold text-orange-600">
                  AED {service.basePrice ?? 0}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>
                  Provider: {service.provider?.name || "ServiceHub Partner"}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-orange-500">★</span>
                  {service.rating?.toFixed(1) ?? "4.6"}
                </span>
              </div>
              <Link
                href={`/booking?serviceId=${service._id}`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
