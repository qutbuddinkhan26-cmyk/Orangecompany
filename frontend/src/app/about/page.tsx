import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Users, Clock, Star, Award, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-purple-600">ServiceHub</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-gray-600 hover:text-purple-600">Services</Link>
            <Link href="/about" className="text-purple-600 font-medium">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-purple-600">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="outline">Login</Button></Link>
            <Link href="/register"><Button>Sign Up</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About ServiceHub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">We are on a mission to make professional home services accessible, affordable, and reliable for everyone.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">ServiceHub was founded with a simple idea: everyone deserves access to quality home services at fair prices. We connect skilled professionals with customers who need their expertise.</p>
              <p className="text-gray-600 mb-4">Our platform ensures that every service provider is verified, trained, and committed to delivering excellence. We handle the booking, payments, and quality assurance so you can focus on what matters most.</p>
              <p className="text-gray-600">From home cleaning to electrical repairs, beauty services to pest control, we cover every aspect of home maintenance and care.</p>
            </div>
            <div className="bg-purple-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center"><p className="text-4xl font-bold text-purple-600">10K+</p><p className="text-gray-600">Professionals</p></div>
                <div className="text-center"><p className="text-4xl font-bold text-purple-600">5M+</p><p className="text-gray-600">Happy Customers</p></div>
                <div className="text-center"><p className="text-4xl font-bold text-purple-600">100+</p><p className="text-gray-600">Services</p></div>
                <div className="text-center"><p className="text-4xl font-bold text-purple-600">50+</p><p className="text-gray-600">Cities</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{icon: Shield, title: "Trust & Safety", desc: "Every professional is background-verified and trained. Your safety is our top priority."},
              {icon: Star, title: "Quality First", desc: "We maintain strict quality standards. Every service comes with a satisfaction guarantee."},
              {icon: Clock, title: "On-Time Service", desc: "We respect your time. Our professionals arrive on schedule, every time."},
              {icon: Heart, title: "Customer Care", desc: "24/7 customer support to help you with any questions or concerns."},
              {icon: Award, title: "Fair Pricing", desc: "Transparent pricing with no hidden charges. Pay only for what you get."},
              {icon: Users, title: "Community", desc: "We empower local professionals with training, tools, and a steady income."}].map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                <v.icon className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-purple-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-purple-100 mb-8 text-lg">Join millions of satisfied customers who trust ServiceHub for their home service needs.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/services"><Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">Browse Services</Button></Link>
            <Link href="/register"><Button variant="outline" className="border-white text-white hover:bg-purple-700 px-8 py-3">Join as Professional</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} ServiceHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
