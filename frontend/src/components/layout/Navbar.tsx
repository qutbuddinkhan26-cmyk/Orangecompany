'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
	{ href: '/', label: 'Home' },
	{ href: '/services', label: 'Services' },
	{ href: '/about', label: 'About' },
	{ href: '/contact', label: 'Contact' },
];

const isActiveRoute = (pathname: string, href: string) => {
	if (href === '/') {
		return pathname === '/';
	}
	return pathname.startsWith(href);
};

export default function Navbar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = () => setIsOpen((prev) => !prev);
	const handleClose = () => setIsOpen(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/90 backdrop-blur">
			<nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
				<Link
					href="/"
					className="text-lg font-semibold tracking-tight text-slate-900"
					onClick={handleClose}
				>
					OrangeCompany
				</Link>

				<div className="hidden items-center gap-8 md:flex">
					<div className="flex items-center gap-6">
						{navLinks.map((link) => {
							const active = isActiveRoute(pathname, link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									className={
										active
											? 'text-orange-600'
											: 'text-slate-700 transition hover:text-orange-600'
									}
								>
									{link.label}
								</Link>
							);
						})}
					</div>
					<div className="flex items-center gap-3">
						<Link
							href="/login"
							className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-orange-600"
						>
							Login
						</Link>
						<Link
							href="/register"
							className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
						>
							Sign Up
						</Link>
					</div>
				</div>

				<button
					type="button"
					aria-label="Toggle navigation menu"
					aria-expanded={isOpen}
					onClick={handleToggle}
					className="inline-flex items-center justify-center rounded-md border border-orange-200 p-2 text-orange-600 transition hover:bg-orange-50 md:hidden"
				>
					<span className="block h-0.5 w-6 bg-orange-600" />
					<span className="mt-1.5 block h-0.5 w-6 bg-orange-600" />
					<span className="mt-1.5 block h-0.5 w-6 bg-orange-600" />
				</button>
			</nav>

			<div
				className={
					isOpen
						? 'border-t border-orange-100 bg-white md:hidden'
						: 'hidden'
				}
			>
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5">
					{navLinks.map((link) => {
						const active = isActiveRoute(pathname, link.href);
						return (
							<Link
								key={link.href}
								href={link.href}
								onClick={handleClose}
								className={
									active
										? 'text-orange-600'
										: 'text-slate-700 transition hover:text-orange-600'
								}
							>
								{link.label}
							</Link>
						);
					})}
					<div className="flex flex-col gap-3 pt-2">
						<Link
							href="/login"
							onClick={handleClose}
							className="rounded-full border border-orange-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
						>
							Login
						</Link>
						<Link
							href="/register"
							onClick={handleClose}
							className="rounded-full bg-orange-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-orange-500"
						>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}