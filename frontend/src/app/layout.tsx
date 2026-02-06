import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServiceHub - Book Home Services Online",
  description: "Professional home services at your doorstep. Book cleaning, repairs, beauty services, and more.",
  keywords: "home services, cleaning, beauty, repairs, maintenance, professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
