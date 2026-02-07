import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      title: "Easy Booking",
      description: "Book trusted professionals in Dubai within minutes.",
      icon: "⚡",
    },
    {
      title: "Trusted Providers",
      description: "Every pro is vetted, trained, and reviewed by customers.",
      icon: "✅",
    },
    {
      title: "Best Prices",
      description: "Transparent rates with no hidden charges, always in AED.",
      icon: "💸",
    },
  ];

  const popularServices = [
    {
      id: "1",
      name: "AC Cooling Tune-Up",
      category: "AC Repair",
      price: 350,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=800",
    },
    {
      id: "2",
      name: "Deep Home Cleaning",
      category: "Cleaning",
      price: 220,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    },
    {
      id: "3",
      name: "Electrical Safety Upgrade",
      category: "Electrical",
      price: 320,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    },
  ];

  const steps = [
    {
      title: "Tell us what you need",
      description: "Select a service and share your preferred time.",
    },
    {
      title: "Get matched instantly",
      description: "We assign the best local pro based on skills and reviews.",
    },
    {
      title: "Relax while we handle it",
      description: "Track the visit and pay securely once the job is done.",
    },
  ];

  const testimonials = [
    {
      name: "Maya Al Zahra",
      role: "Dubai Marina",
      quote:
        "ServiceHub booked my AC repair in under 10 minutes. The technician was punctual and professional.",
    },
    {
      name: "Omar Haddad",
      role: "Business Bay",
      quote:
        "Transparent pricing and quick support. I love how easy it is to rebook trusted providers.",
    },
    {
      name: "Sophia Khan",
      role: "Downtown Dubai",
      quote:
        "My apartment has never looked better. The team arrived on time and delivered a flawless clean.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                ServiceHub Dubai
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl">
                Book trusted home services in Dubai in minutes
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                From AC repair to deep cleaning, ServiceHub connects you with verified
                professionals and upfront AED pricing.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                  Browse services
                </Link>
                <span className="text-sm font-semibold text-slate-500">
                  Same-day slots available across Dubai
                </span>
              </div>
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-xl">
              <div className="space-y-4">
                <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-700">
                  4.8 average rating from 10k+ bookings
                </div>
                <div className="grid gap-3">
                  {[
                    "AC repairs and maintenance",
                    "Premium home cleaning",
                    "Electrical and plumbing fixes",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                    >
                      <span className="font-medium text-slate-700">{item}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-600">
                        From AED 199
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-dashed border-orange-200 px-4 py-3 text-sm text-slate-500">
                  Tell us your need and we will match you instantly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
            >
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                Popular Services
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                Dubai loves these services
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-orange-600"
            >
              View all services
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <div className="h-44 w-full bg-slate-200">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {service.category}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {service.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Rating {service.rating.toFixed(1)}</span>
                    <span className="text-base font-semibold text-orange-600">
                      AED {service.price}
                    </span>
                  </div>
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    Book now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              Three simple steps to a spotless home
            </h2>
            <p className="mt-4 text-sm text-slate-500">
              Bookings take less than two minutes and updates land directly in
              your dashboard.
            </p>
          </div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-orange-100 bg-white p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-900 py-16 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Trusted by busy Dubai residents
            </h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-sm text-orange-100">{testimonial.quote}</p>
                <div className="mt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-orange-200">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="rounded-3xl bg-orange-600 px-8 py-10 text-center text-white md:px-16">
          <h2 className="text-3xl font-semibold">
            Ready to book your next service?
          </h2>
          <p className="mt-3 text-sm text-orange-100">
            Get matched with top-rated professionals across Dubai.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
          >
            Explore services
          </Link>
        </div>
      </section>
    </div>
  );
}
