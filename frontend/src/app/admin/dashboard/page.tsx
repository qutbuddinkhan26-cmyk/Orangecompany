import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, ShoppingBag, Calendar, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const stats = [{label: "Total Users", value: "12,456", change: "+12%", icon: Users, color: "bg-blue-50 text-blue-600"}, {label: "Total Services", value: "148", change: "+5%", icon: ShoppingBag, color: "bg-green-50 text-green-600"}, {label: "Total Bookings", value: "8,923", change: "+18%", icon: Calendar, color: "bg-purple-50 text-purple-600"}, {label: "Revenue", value: "$89,450", change: "+22%", icon: DollarSign, color: "bg-yellow-50 text-yellow-600"}];
  const recentUsers = [{name: "Ahmed Khan", email: "ahmed@email.com", role: "customer", joined: "Feb 7"}, {name: "Lisa Wong", email: "lisa@email.com", role: "provider", joined: "Feb 6"}, {name: "Raj Patel", email: "raj@email.com", role: "customer", joined: "Feb 6"}, {name: "Maria Garcia", email: "maria@email.com", role: "provider", joined: "Feb 5"}];
  const recentBookings = [{id: "#SH2001", customer: "John D.", service: "Deep Cleaning", amount: 999, status: "completed"}, {id: "#SH2002", customer: "Sarah A.", service: "AC Repair", amount: 499, status: "in-progress"}, {id: "#SH2003", customer: "Mike C.", service: "Plumbing", amount: 349, status: "pending"}, {id: "#SH2004", customer: "Priya P.", service: "Electrical", amount: 399, status: "completed"}];
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white"><div className="container mx-auto px-4 py-4 flex items-center justify-between"><Link href="/" className="text-2xl font-bold text-purple-600">ServiceHub <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded ml-2">Admin</span></Link><Link href="/"><Button variant="outline" size="sm">Logout</Button></Link></div></header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{stats.map((s, i) => <div key={i} className="bg-white rounded-xl p-5 shadow-sm"><div className="flex items-center justify-between mb-3"><div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><s.icon className="h-5 w-5" /></div><span className="text-xs text-green-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{s.change}</span></div><p className="text-2xl font-bold">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>)}</div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm"><div className="p-5 border-b flex justify-between items-center"><h2 className="font-semibold">Recent Users</h2><Button variant="outline" size="sm">View All</Button></div><div className="divide-y">{recentUsers.map((u, i) => <div key={i} className="p-4 flex items-center justify-between"><div><p className="font-medium">{u.name}</p><p className="text-sm text-gray-500">{u.email}</p></div><div className="text-right"><span className={`text-xs px-2 py-1 rounded-full ${u.role === "provider" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>{u.role}</span><p className="text-xs text-gray-400 mt-1">{u.joined}</p></div></div>)}</div></div>
          <div className="bg-white rounded-xl shadow-sm"><div className="p-5 border-b flex justify-between items-center"><h2 className="font-semibold">Recent Bookings</h2><Button variant="outline" size="sm">View All</Button></div><div className="divide-y">{recentBookings.map(b => <div key={b.id} className="p-4 flex items-center justify-between"><div><p className="font-medium">{b.customer}</p><p className="text-sm text-gray-500">{b.service} - {b.id}</p></div><div className="text-right"><span className={`text-xs px-2 py-1 rounded-full ${b.status === "completed" ? "bg-green-100 text-green-700" : b.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{b.status}</span><p className="text-sm font-semibold mt-1">&#8377;{b.amount}</p></div></div>)}</div></div>
        </div>
      </div>
    </div>
  );
}
