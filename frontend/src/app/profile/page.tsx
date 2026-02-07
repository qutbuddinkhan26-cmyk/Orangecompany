"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/api";

type Profile = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const data = (await getUserProfile()) as Profile;
        if (isMounted) {
          setProfile({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        }
      } catch (err) {
        const message =
          typeof err === "object" && err && "message" in err
            ? String((err as { message?: string }).message)
            : "Failed to load profile.";
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
      loadProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = (await updateUserProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      })) as Profile;

      setProfile({
        name: updated.name || profile.name,
        email: updated.email || profile.email,
        phone: updated.phone || profile.phone,
        address: updated.address || profile.address,
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message?: string }).message)
          : "Failed to update profile.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
            Profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Manage your details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Keep your contact information up to date for smoother bookings.
          </p>
        </div>

        {loading && (
          <div className="mt-8 space-y-4">
            <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-200" />
          </div>
        )}

        {!loading && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
          >
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, name: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, phone: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="address">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={profile.address}
                onChange={(event) =>
                  setProfile((prev) => ({ ...prev, address: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
