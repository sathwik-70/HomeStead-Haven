import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, CreditCard, Home as HomeIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchBookings } from '../services/dataService';
import { Booking } from '../types';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const AdminDashboard: React.FC = () => {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const bookings = await fetchBookings();
      setRecentBookings(bookings.slice(0, 5)); // Show only 5 recent
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen pt-28 px-4 max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Revenue", value: "$48,290", icon: CreditCard, gradient: "from-emerald-400 to-emerald-600" },
          { title: "Active Bookings", value: loading ? "..." : "24", icon: TrendingUp, gradient: "from-cyan-400 to-cyan-600" },
          { title: "Total Users", value: "1,203", icon: Users, gradient: "from-blue-400 to-blue-600" },
          { title: "Properties", value: "48", icon: HomeIcon, gradient: "from-teal-400 to-teal-600" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-gray-200`}>
                <stat.icon size={24} />
              </div>
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-bold">+12%</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} /> // emerald-500 / blue-500
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Bookings</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="text-slate-500 text-sm">Loading bookings...</div>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {booking.id.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-slate-900 text-sm font-medium">Booking #{booking.id.slice(0, 8)}</h4>
                    <p className="text-slate-500 text-xs">${booking.totalPrice}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm italic">No recent bookings found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;