"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, CreditCard, CheckCircle } from "lucide-react";

const services: Record<string, { name: string; price: number }> = {
  "1": { name: "Deep Home Cleaning", price: 999 },
  "2": { name: "AC Service & Repair", price: 499 },
  "3": { name: "Salon for Women", price: 799 },
  "4": { name: "Plumbing Repair", price: 349 },
  "5": { name: "Electrical Work", price: 399 },
  "6": { name: "Pest Control", price: 599 },
};

function BookingForm() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service") || "1";
  const service = services[serviceId] || services["1"];
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("cash");
  const [booked, setBooked] = useState(false);
  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
  if (booked) return (
    <div className="text-center py-20"><CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" /><h2 className="text-3xl font-bold text-green-600 mb-3">Booking Confirmed!</h2><p className="text-gray-600 mb-2">Your booking for <strong>{service.name}</strong> has been confirmed.</p><p className="text-gray-500 mb-1">{date} at {time}</p><p className="text-gray-500 mb-6">Booking ID: #SH{Date.now().toString().slice(-6)}</p><p className="text-sm text-gray-400 mb-8">You will receive a confirmation email shortly.</p><Link href="/"><Button className="bg-purple-600 hover:bg-purple-700">Back to Home</Button></Link></div>
  );
  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-8">{["Date & Time", "Address", "Payment"].map((s, i) => <div key={i} className={`flex items-center gap-2 ${i + 1 <= step ? "text-purple-600" : "text-gray-400"}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i + 1 <= step ? "bg-purple-600 text-white" : "bg-gray-200"}`}>{i + 1}</div><span className="hidden md:inline font-medium">{s}</span></div>)}</div>
      <div className="bg-white border rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-1">{service.name}</h3>
        <p className="text-2xl font-bold text-purple-600">&#8377;{service.price}</p>
      </div>
      {step === 1 && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-purple-600" />Select Date</h3>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
          <h3 className="text-lg font-semibold flex items-center gap-2"><Clock className="h-5 w-5 text-purple-600" />Select Time</h3>
          <div className="grid grid-cols-4 gap-2">{timeSlots.map(t => <button key={t} onClick={() => setTime(t)} className={`p-2 rounded-lg border text-sm ${time === t ? "bg-purple-600 text-white border-purple-600" : "hover:border-purple-300"}`}>{t}</button>)}</div>
          <Button onClick={() => setStep(2)} disabled={!date || !time} className="w-full bg-purple-600 hover:bg-purple-700 mt-4">Continue</Button>
        </div>
      )}
      {step === 2 && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-purple-600" />Service Address</h3>
          <Input placeholder="Full address" value={address} onChange={e => setAddress(e.target.value)} />
          <textarea className="w-full border rounded-lg p-3 min-h-[80px]" placeholder="Special instructions (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
          <div className="flex gap-3"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)} disabled={!address} className="flex-1 bg-purple-600 hover:bg-purple-700">Continue</Button></div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5 text-purple-600" />Payment Method</h3>
          {["cash", "card", "upi"].map(p => <button key={p} onClick={() => setPayment(p)} className={`w-full p-4 rounded-lg border text-left ${payment === p ? "border-purple-600 bg-purple-50" : "hover:border-gray-400"}`}><span className="font-medium capitalize">{p === "cash" ? "Cash on Service" : p === "card" ? "Credit/Debit Card" : "UPI Payment"}</span></button>)}
          <div className="border-t pt-4 mt-4 space-y-2"><div className="flex justify-between"><span>Service</span><span>&#8377;{service.price}</span></div><div className="flex justify-between"><span>Platform fee</span><span>&#8377;49</span></div><div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-purple-600">&#8377;{service.price + 49}</span></div></div>
          <div className="flex gap-3"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button onClick={() => setBooked(true)} className="flex-1 bg-purple-600 hover:bg-purple-700">Confirm Booking</Button></div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white"><div className="container mx-auto px-4 py-4 flex items-center justify-between"><Link href="/" className="text-2xl font-bold text-purple-600">ServiceHub</Link><Link href="/"><Button variant="outline">Cancel</Button></Link></div></header>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8 text-center">Book Your Service</h1>
        <Suspense fallback={<div>Loading...</div>}><BookingForm /></Suspense>
      </div>
    </div>
  );
}
