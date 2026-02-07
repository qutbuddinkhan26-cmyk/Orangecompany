export default function AboutPage() {
  const stats = [
    { label: "Services", value: "1000+" },
    { label: "Providers", value: "500+" },
    { label: "Bookings", value: "10,000+" },
    { label: "Rating", value: "4.8" },
  ];

  const team = [
    {
      name: "Ayesha Rahman",
      role: "Founder & CEO",
      bio: "Hospitality leader focused on elevating everyday living in Dubai.",
    },
    {
      name: "Hassan Malik",
      role: "Head of Operations",
      bio: "Builds reliable service delivery across the city with local partners.",
    },
    {
      name: "Leila Noor",
      role: "Customer Success Lead",
      bio: "Ensures every ServiceHub booking feels effortless and personal.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
        <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="mx-auto w-full max-w-4xl px-4 text-center md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
            About ServiceHub
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl">
            A Dubai-based platform redefining home services
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            ServiceHub connects residents with vetted professionals for cleaning,
            repairs, and maintenance - all with transparent pricing in AED.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Our story
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              Built for fast-moving Dubai lives
            </h2>
            <p className="mt-4 text-sm text-slate-500">
              ServiceHub started with a single idea: make reliable home services
              feel as easy as ordering dinner. We partnered with top providers
              across Dubai to deliver consistent quality, honest pricing, and
              real-time support.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Today, we help busy residents, families, and businesses book
              everything from AC maintenance to handyman support with a few taps.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-2xl border border-orange-100 bg-white p-6">
              <p className="text-sm font-semibold text-slate-900">Mission</p>
              <p className="mt-2 text-sm text-slate-500">
                Deliver stress-free home services by matching residents with
                trusted local professionals.
              </p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-white p-6">
              <p className="text-sm font-semibold text-slate-900">Vision</p>
              <p className="mt-2 text-sm text-slate-500">
                Become Dubai's most reliable home services ecosystem for every
                household and business.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-orange-100 bg-orange-50 p-6 text-center"
              >
                <p className="text-3xl font-semibold text-orange-600">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
              Team
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              The people behind ServiceHub
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Passionate about craftsmanship, hospitality, and technology.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-semibold text-orange-600">
                {member.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {member.name}
              </h3>
              <p className="text-sm font-semibold text-orange-600">
                {member.role}
              </p>
              <p className="mt-3 text-sm text-slate-500">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
