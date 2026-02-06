"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Clock, ArrowLeft, Filter } from "lucide-react";

const staticServices = [
  { _id: "1", name: "Deep Home Cleaning", price: 999, rating: 4.8, reviewCount: 2534, duration: "3-4 hours", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400", category: "Home Cleaning" },
  { _id: "2", name: "AC Service & Repair", price: 499, rating: 4.7, reviewCount: 1823, duration: "1-2 hours", image: "https://images.unsplash.com/photo-1631545806609-fa7e4ad5c2e0?w=400", category: "Appliance Repair" },
  { _id: "3", name: "Salon for Women", price: 799, rating: 4.9, reviewCount: 3421, duration: "2-3 hours", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400", category: "Beauty & Spa" },
  { _id: "4", name: "Plumbing Repair", price: 349, rating: 4.6, reviewCount: 987, duration: "1-2 hours", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400", category: "Plumbing" },
  { _id: "5", name: "Electrical Work", price: 399, rating: 4.7, reviewCount: 1245, duration: "1-3 hours", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", category: "Electrical" },
  { _id: "6", name: "Pest Control", price: 599, rating: 4.5, reviewCount: 756, duration: "2-3 hours", image: "https://images.unsplash.com/photo-1632935190868-ee68f0e9afb7?w=400", category: "Pest Control" },
  { _id: "7", name: "Full Home Painting", price: 2999, rating: 4.6, reviewCount: 432, duration: "1-2 days", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", category: "Painting" },
  { _id: "8", name: "Carpet Cleaning", price: 699, rating: 4.5, reviewCount: 654, duration: "2-3 hours", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400", category: "Home Cleaning" },
  { _id: "9", name: "Furniture Assembly", price: 449, rating: 4.4, reviewCount: 321, duration: "1-3 hours", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", category: "Carpentry" },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState("all");
  const categories = ["all", ...Array.from(new Set(staticServices.map(s => s.category)))];
  let filtered = staticServices.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) && (category === "all" || s.category === category));
  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white sticky top-0 z-50"><div className="container mx-auto px-4 py-4 flex items-center justify-between"><Link href="/" className="text-2xl font-bold text-purple-600">ServiceHub</Link><div className="flex items-center gap-3"><Link href="/login"><Button variant="outline">Login</Button></Link><Link href="/register"><Button>Sign Up</Button></Link></div></div></header>
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-10"><div className="container mx-auto px-4"><Link href="/" className="text-purple-600 flex items-center gap-1 mb-4 text-sm"><ArrowLeft className="h-4 w-4" /> Back to Home</Link><h1 className="text-3xl font-bold mb-2">All Services</h1><p className="text-gray-600 mb-6">Browse our complete range of professional home services</p><div className="flex gap-2 max-w-xl"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input className="pl-10" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} /></div><Button className="bg-purple-600 hover:bg-purple-700"><Search className="h-4 w-4 mr-2" />Search</Button></div></div></div>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2"><Filter className="h-4 w-4" /><span className="text-sm font-medium">Category:</span></div>
          {categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`text-sm px-3 py-1 rounded-full border ${category === c ? "bg-purple-600 text-white border-purple-600" : "bg-white hover:border-purple-300"}`}>{c === "all" ? "All" : c}</button>)}
          <select value={sort} onChange={e => setSort(e.target.value)} className="ml-auto border rounded-lg px-3 py-1.5 text-sm"><option value="popular">Most Popular</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Highest Rated</option></select>
          <span className="text-sm text-gray-500">{filtered.length} services found</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">{filtered.map(service => (
          <Link key={service._id} href={`/services/${service._id}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{service.category}</span>
              <h3 className="font-semibold mt-2 mb-1">{service.name}</h3>
              <div className="flex items-center gap-2 mb-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span className="text-sm font-medium">{service.rating}</span><span className="text-xs text-gray-500">({service.reviewCount} reviews)</span></div>
              <div className="flex items-center justify-between"><span className="text-lg font-bold text-purple-600">&#8377;{service.price}</span><span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" />{service.duration}</span></div>
            </div>
          </Link>
        ))}</div>
      </div>
      <footer className="bg-gray-900 text-gray-400 py-8 mt-8"><div className="container mx-auto px-4 text-center"><p>&copy; {new Date().getFullYear()} ServiceHub. All rights reserved.</p></div></footer>
    </div>
  );
}
