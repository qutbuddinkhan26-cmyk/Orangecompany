'use client';

import Link from 'next/link';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const serviceLinks = [
  { href: '/services?category=ac-repair', label: 'AC Repair' },
  { href: '/services?category=plumbing', label: 'Plumbing' },
  { href: '/services?category=electrical', label: 'Electrical' },
  { href: '/services?category=cleaning', label: 'Cleaning' },
];

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook' },
  { href: 'https://twitter.com', label: 'Twitter' },
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="text-xl font-semibold text-white">ServiceHub</p>
            <p className="text-sm leading-relaxed text-slate-300">
              Trusted home services across Dubai with vetted professionals and
              transparent pricing.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-sm font-semibold text-slate-200 transition hover:border-orange-600 hover:text-orange-600"
                  aria-label={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Quick Links
            </p>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-orange-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Services
            </p>
            <ul className="space-y-2 text-sm">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-orange-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Contact
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Dubai, UAE</li>
              <li>
                <a
                  href="tel:+971500000000"
                  className="transition hover:text-orange-600"
                >
                  +971 50 000 0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@servicehub.ae"
                  className="transition hover:text-orange-600"
                >
                  hello@servicehub.ae
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 md:flex-row md:px-6">
          <p>© 2026 ServiceHub. All rights reserved.</p>
          <p>
            Crafted with care in Dubai.
          </p>
        </div>
      </div>
    </footer>
  );
}
