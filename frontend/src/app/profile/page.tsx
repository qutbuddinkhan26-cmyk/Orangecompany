"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({name: "Qutbuddin Khan", email: "qutbuddin@example.com", phone: "+971 50 123 4567", address: "Dubai Marina, Dubai, UAE"});
  const [saved, setSaved] = useState(false);
  const handleSave = (e: React.FormEvent) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white"><div className="container mx-auto px-4 py-4 flex items-center justify-between"><Link href="/" className="text-2xl font-bold text-purple-600">ServiceHub</Link><nav className="flex items-center gap-4"><Link href="/dashboard" className="text-gray-600 hover:text-purple-600">Dashboard</Link><Link href="/"><Button variant="outline" size="sm">Logout</Button></Link></nav></div></header>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">My Profile</h1>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative"><div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center"><User className="h-12 w-12 text-purple-600" /></div><button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center"><Camera className="h-4 w-4 text-white" /></button></div>
            <div><h2 className="text-xl font-bold">{profile.name}</h2><p className="text-gray-500">Member since January 2026</p></div>
          </div>
          <form onSubmit={handleSave} className="space-y-5">
            <div><label className="block text-sm font-medium mb-1">Full Name</label><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input className="pl-10" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></div></div>
            <div><label className="block text-sm font-medium mb-1">Email</label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input className="pl-10" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} /></div></div>
            <div><label className="block text-sm font-medium mb-1">Phone</label><div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input className="pl-10" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} /></div></div>
            <div><label className="block text-sm font-medium mb-1">Address</label><div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" /><Input className="pl-10" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} /></div></div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"><Save className="h-4 w-4" />{saved ? "Saved!" : "Save Changes"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
