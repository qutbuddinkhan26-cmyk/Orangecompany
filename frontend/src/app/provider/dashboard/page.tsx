import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Star, Clock, CheckCircle, XCircle, BarChart3 } from "lucide-react";

export default function ProviderDashboard() {
  const stats = [{label: "Total Bookings", value: "156", icon: Calendar, color: "bg-blue-50 text-blue-600"}, {label: "Earnings", value: "$12,450", icon: DollarSign, color: "bg-green-50 text-green-600"}, {label: "Rating", value: "4.8", icon: Star, color: "bg-yellow-50 text-yellow-600"}, {label: "Completion Rate", value: "98%", icon: BarChart3, color: "bg-purple-50 text-purple-600"}];
  const bookings = [{id: "#SH001", customer: "Sarah Ahmed", service: "Deep Cleaning", date: "Feb 8, 2026", time: "10:00 AM", status: "pending", amount: 999}, {id: "#SH002", customer: "Mike Chen", service: "AC Repair", date: "Feb 8, 2026", time: "2:00 PM", status: "confirmed", amount: 499}, {id: "#SH003", customer: "Priya Patel", service: "Plumbing", date: "Feb 9, 2026", time: "11:00 AM", status: "confirmed", amount: 349}, {id: "#SH004", customer: "John Smith", service: "Electrical", date: "Feb 7, 2026", time: "3:00 PM", status: "completed", amount: 399}];
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white"><div className="container mx-auto px-4 py-4 flex items-center justify-between"><Link href="/" className="text-2xl font-bold text-purple-600">ServiceHub</Link><nav className="flex items-center gap-4"><span className="text-gray-600">Provider Dashboard</span><Link href="/"><Button variant="outline" size="sm">Logout</Button></Link></nav></div></header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Welcome back, Provider!</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{stats.map((s, i) => <div key={i} className="bg-white rounded-xl p-5 shadow-sm"><div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}><s.icon className="h-5 w-5" /></div><p className="text-2xl font-bold">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>)}</div>
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b"><h2 className="text-lg font-semibold">Recent Bookings</h2></div>
          <div className="divide-y">{bookings.map(b => <div key={b.id} className="p-4 flex items-center justify-between hover:bg-gray-50"><div><p className="font-medium">{b.customer}</p><p className="text-sm text-gray-500">{b.service} - {b.id}</p></div><div className="text-center"><p className="text-sm">{b.date}</p><p className="text-sm text-gray-500">{b.time}</p></div><div className="text-right"><span className={`text-xs px-2 py-1 rounded-full ${b.status === "completed" ? "bg-green-100 text-green-700" : b.status === "confirmed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{b.status}</span><p className="text-sm font-semibold mt-1">&#8377;{b.amount}</p></div></div>)}</div>
        </div>
      </div>
    </div>
  );
}
