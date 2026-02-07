"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getServices } from "@/lib/api";

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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const data = (await getServices()) as Service[];
        if (isMounted) {
          setServices(data);
        }
      } catch (err) {
        const message =
          typeof err === "object" && err && "message" in err
            ? String((err as { message?: string }).message)
            : "Failed to load services.";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const names = services.map(getCategoryName);
    const unique = Array.from(new Set(names));
    return ["All", ...unique];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory =
        activeCategory === "All" ||
        getCategoryName(service) === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, search, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-orange-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
            Services
          </p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Discover trusted professionals
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Browse ServiceHub offerings and book the right expert in minutes.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-[320px]">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Search
              </label>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by service name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? "rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
                    : "rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-orange-400 hover:text-orange-600"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-44 w-full animate-pulse bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="rounded-2xl border border-orange-100 bg-white px-6 py-10 text-center">
            <p className="text-lg font-semibold text-slate-900">No services found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try a different search term or clear your filters.
            </p>
          </div>
        )}

        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  {getImageUrl(service) ? (
                    <img
                      src={getImageUrl(service)}
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                      Image coming soon
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {getCategoryName(service)}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {service.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                      {service.description || "Professional service delivered by vetted experts."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-orange-600">
                      AED {service.basePrice ?? 0}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <span className="text-orange-500">★</span>
                      <span>{service.rating?.toFixed(1) ?? "4.6"}</span>
                    </div>
                  </div>
                  <Link
                    href={`/services/${service._id}`}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
