"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

interface Earnings {
  today: number;
  week: number;
  month: number;
  total: number;
}

interface Transaction {
  id: string;
  bookingNumber: string;
  amount: number;
  date: string;
  serviceId: string;
}

export default function ProviderEarnings() {
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/provider/earnings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setEarnings(data.earnings);
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Earnings</h1>
        <p className="text-gray-600">Track your income and transactions</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">Today</div>
            <DollarSign className="h-5 w-5 opacity-90" />
          </div>
          <div className="text-3xl font-bold">₹{earnings?.today || 0}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">This Week</div>
            <Calendar className="h-5 w-5 opacity-90" />
          </div>
          <div className="text-3xl font-bold">₹{earnings?.week || 0}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">This Month</div>
            <TrendingUp className="h-5 w-5 opacity-90" />
          </div>
          <div className="text-3xl font-bold">₹{earnings?.month || 0}</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">Total Earnings</div>
            <DollarSign className="h-5 w-5 opacity-90" />
          </div>
          <div className="text-3xl font-bold">₹{earnings?.total || 0}</div>
        </div>
      </div>

      {/* Simple Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Earnings Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-600">Today</div>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                style={{
                  width: `${earnings?.today && earnings?.month ? Math.min((earnings.today / earnings.month) * 100, 100) : 0}%`,
                  minWidth: earnings?.today ? '60px' : '0',
                }}
              >
                {earnings?.today ? `₹${earnings.today}` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-600">This Week</div>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                style={{
                  width: `${earnings?.week && earnings?.month ? Math.min((earnings.week / earnings.month) * 100, 100) : 0}%`,
                  minWidth: earnings?.week ? '60px' : '0',
                }}
              >
                {earnings?.week ? `₹${earnings.week}` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-600">This Month</div>
            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                style={{ width: '100%' }}
              >
                ₹{earnings?.month || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Transaction History</h2>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-semibold text-gray-600">Booking #</th>
                  <th className="pb-3 font-semibold text-gray-600">Date</th>
                  <th className="pb-3 font-semibold text-gray-600 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{transaction.bookingNumber}</td>
                    <td className="py-4 text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-green-600 font-semibold">
                        +₹{transaction.amount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
