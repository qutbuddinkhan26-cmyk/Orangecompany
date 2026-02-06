"use client";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Clock, Shield, CheckCircle, ArrowLeft } from "lucide-react";

const allServices = [
  { id: "1", name: "Deep Home Cleaning", price: 999, rating: 4.8, reviews: 2534, duration: "3-4 hours", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600", category: "Home Cleaning", description: "Professional deep cleaning service for your entire home. Our trained cleaners use eco-friendly products to make your home spotless.", includes: ["Kitchen deep clean", "Bathroom sanitization", "Floor mopping & vacuuming", "Dusting all surfaces", "Window cleaning", "Trash removal"] },
  { id: "2", name: "AC Service & Repair", price: 499, rating: 4.7, reviews: 1823, duration: "1-2 hours", image: "https://images.unsplash.com/photo-1631545806609-fa7e4ad5c2e0?w=600", category: "Appliance Repair", description: "Complete AC servicing including gas check, filter cleaning, and performance optimization by certified technicians.", includes: ["Filter cleaning", "Gas pressure check", "Coil cleaning", "Drainage check", "Performance test", "Thermostat calibration"] },
  { id: "3", name: "Salon for Women", price: 799, rating: 4.9, reviews: 3421, duration: "2-3 hours", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600", category: "Beauty & Spa", description: "Premium salon services at your doorstep. Our beauticians bring everything needed for a luxurious experience.", includes: ["Haircut & styling", "Facial treatment", "Manicure", "Pedicure", "Threading", "Waxing"] },
  { id: "4", name: "Plumbing Repair", price: 349, rating: 4.6, reviews: 987, duration: "1-2 hours", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600", category: "Plumbing", description: "Expert plumbing services for leaks, installations, and repairs. Our plumbers handle all residential plumbing issues.", includes: ["Leak repair", "Pipe installation", "Faucet replacement", "Drain cleaning", "Water heater service", "Toilet repair"] },
  { id: "5", name: "Electrical Work", price: 399, rating: 4.7, reviews: 1245, duration: "1-3 hours", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600", category: "Electrical", description: "Licensed electricians for all your electrical needs. Safe, reliable, and up to code.", includes: ["Wiring repair", "Switch/socket install", "Fan installation", "Light fitting", "Circuit breaker fix", "Safety inspection"] },
  { id: "6", name: "Pest Control", price: 599, rating: 4.5, reviews: 756, duration: "2-3 hours", image: "https://images.unsplash.com/photo-1632935190868-ee68f0e9afb7?w=600", category: "Pest Control", description: "Comprehensive pest control treatment for a pest-free home. Safe for children and pets.", includes: ["Cockroach treatment", "Ant control", "Bed bug treatment", "Termite control", "Mosquito treatment", "Rodent control"] },
];

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const service = allServices.find(s => s.id === id) || allServices[0];
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white sticky top-0 z-50"><div className="container mx-auto px-4 py-4 flex items-center justify-between"><Link href="/" className="text-2xl font-bold text-purple-600">ServiceHub</Link><div className="flex items-center gap-3"><Link href="/login"><Button variant="outline">Login</Button></Link><Link href="/register"><Button>Sign Up</Button></Link></div></div></header>
      <div className="container mx-auto px-4 py-8">
        <Link href="/services" className="flex items-center gap-2 text-purple-600 mb-6 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Services</Link>
        <div className="grid md:grid-cols-2 gap-10">
          <div><img src={service.image} alt={service.name} className="w-full h-[400px] object-cover rounded-xl" /><div className="flex gap-4 mt-4">{[service.image, service.image, service.image].map((img, i) => <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-purple-500" />)}</div></div>
          <div>
            <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">{service.category}</span>
            <h1 className="text-3xl font-bold mt-3 mb-2">{service.name}</h1>
            <div className="flex items-center gap-4 mb-4"><div className="flex items-center gap-1"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /><span className="font-semibold">{service.rating}</span></div><span className="text-gray-500">({service.reviews} reviews)</span><div className="flex items-center gap-1 text-gray-500"><Clock className="h-4 w-4" />{service.duration}</div></div>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <div className="text-3xl font-bold text-purple-600 mb-6">&#8377;{service.price}</div>
            <div className="mb-6"><h3 className="font-semibold mb-3">What is Included:</h3><div className="grid grid-cols-2 gap-2">{service.includes.map((item, i) => <div key={i} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-sm text-gray-600">{item}</span></div>)}</div></div>
            <div className="flex items-center gap-3 mb-6"><Shield className="h-5 w-5 text-green-600" /><span className="text-sm text-gray-600">Verified professionals with background checks</span></div>
            <Link href={`/booking?service=${service.id}`}><Button className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg">Book Now - &#8377;{service.price}</Button></Link>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16"><div className="container mx-auto px-4 text-center"><p>&copy; {new Date().getFullYear()} ServiceHub. All rights reserved.</p></div></footer>
    </div>
  );
}
