"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="mx-auto w-full max-w-4xl px-4 text-center md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
            Contact
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl">
            Let's talk about your service needs
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Reach out to our Dubai team for bookings, support, or partnership
            queries.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            {sent ? (
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                  Message received
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                  Thanks for reaching out
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Our team will get back to you within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                    Send a message
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    We would love to hear from you
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="name">
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, name: event.target.value }))
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
                      value={form.email}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="subject">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, subject: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, message: event.target.value }))
                    }
                    className="min-h-[140px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                  Send message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-orange-100 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                Contact info
              </p>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-900">Address</p>
                  <p>Dubai Business Bay</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Phone</p>
                  <p>+971-4-XXX-XXXX</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Email</p>
                  <p>info@servicehub.ae</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Working hours</p>
                  <p>Sun - Thu, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                Map
              </p>
              <div className="mt-4 flex h-48 items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-orange-50 text-sm text-orange-600">
                Map placeholder
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
