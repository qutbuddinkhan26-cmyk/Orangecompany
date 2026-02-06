"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-purple-600">ServiceHub</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-gray-600 hover:text-purple-600">Services</Link>
            <Link href="/about" className="text-gray-600 hover:text-purple-600">About</Link>
            <Link href="/contact" className="text-purple-600 font-medium">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="outline">Login</Button></Link>
            <Link href="/register"><Button>Sign Up</Button></Link>
          </div>
        </div>
      </header>
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">Have questions? We would love to hear from you.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4"><Mail className="h-6 w-6 text-purple-600 mt-1" /><div><h3 className="font-semibold">Email</h3><p className="text-gray-600">support@servicehub.com</p></div></div>
                <div className="flex items-start gap-4"><Phone className="h-6 w-6 text-purple-600 mt-1" /><div><h3 className="font-semibold">Phone</h3><p className="text-gray-600">+971 4 123 4567</p></div></div>
                <div className="flex items-start gap-4"><MapPin className="h-6 w-6 text-purple-600 mt-1" /><div><h3 className="font-semibold">Office</h3><p className="text-gray-600">Dubai Internet City, Dubai, UAE</p></div></div>
              </div>
              <div className="mt-8 p-6 bg-purple-50 rounded-xl">
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-gray-600">Monday - Saturday: 8:00 AM - 10:00 PM</p>
                <p className="text-gray-600">Sunday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-8 shadow-sm">
              {sent ? (
                <div className="text-center py-12"><Send className="h-16 w-16 text-green-500 mx-auto mb-4" /><h3 className="text-2xl font-bold text-green-600 mb-2">Message Sent!</h3><p className="text-gray-600">We will get back to you within 24 hours.</p></div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
                  <div><label className="block text-sm font-medium mb-1">Full Name</label><Input placeholder="Your name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium mb-1">Email</label><Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium mb-1">Subject</label><Input placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium mb-1">Message</label><textarea className="w-full border rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Tell us more..." value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} required /></div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-400 py-8"><div className="container mx-auto px-4 text-center"><p>&copy; {new Date().getFullYear()} ServiceHub. All rights reserved.</p></div></footer>
    </div>
  );
}
