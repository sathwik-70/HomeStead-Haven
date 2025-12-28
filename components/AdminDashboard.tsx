
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, CreditCard, Home as HomeIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchBookings } from '../services/dataService';
import { Booking } from '../types';

const data = [
  { name: 'Jan', revenue: 400000 },
  { name: 'Feb', revenue: 350000 },
  { name: 'Mar', revenue: 200000 },
  { name: 'Apr', revenue: 278000 },
  { name: 'May', revenue: 589000 },
  { name: 'Jun', revenue: 739000 },
  { name: 'Jul', revenue: 949000 },
];

const AdminDashboard: React.FC = () => {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const bookings = await fetchBookings();
      setRecentBookings(bookings.slice(0, 5));
      setLoading(false);
    };
    loadData();
  }, []);

  const formatCurrency = (val: number) => {
    return `₹${new Intl.NumberFormat('en-IN').format(val)}`;
  };

  return (
    <div className="min-h-screen pt-28 px-4 max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Performance</h1>
        <p className="text-slate-500">Pan-India property metrics and revenue insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Revenue", value: "₹4.82L", icon: CreditCard, gradient: "from-emerald-400 to-emerald-600" },
          { title: "Active Bookings", value: loading ? "..." : "18", icon: TrendingUp, gradient: "from-cyan-400 to-cyan-600" },
          { title: "Total Users", value: "842", icon: Users, gradient: "from-blue-400 to-blue-600" },
          { title: "Total Units", value: "24", icon: HomeIcon, gradient: "from-teal-400 to-teal-600" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full text-xs font-bold">+15%</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Analytics (INR)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: 'rgba(16, 185, 129, 0.1)'}}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Enquiries</h3>
          <div className="space-y-4">
            {!loading && recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-3 hover:bg-white/40 dark:hover:bg-slate-700/40 rounded-xl transition-colors border border-transparent">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    {booking.id.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 dark:text-white text-sm font-medium truncate">#{booking.id.slice(0, 8)}</h4>
                    <p className="text-slate-500 text-xs">{formatCurrency(booking.totalPrice)}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">Loading data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
