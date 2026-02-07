import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/app/providers";

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
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
