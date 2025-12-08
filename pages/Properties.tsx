import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Filter } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties, createBooking } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Property } from '../types';
import { motion } from 'framer-motion';

const Properties: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(10000);
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      const data = await fetchProperties();
      setProperties(data);
      setIsLoading(false);
    };
    loadProperties();
  }, []);

  const handleBook = async (property: Property) => {
    if (!user) {
      if (confirm("You need to be signed in to book a property. Sign in with Google now?")) {
        signInWithGoogle();
      }
      return;
    }

    const bookingData = {
      propertyId: property.id,
      userId: user.id,
      totalPrice: property.price,
      status: 'pending' as const,
      date: new Date().toISOString()
    };

    const result = await createBooking(bookingData);
    if (result.success) {
      alert(`Booking request sent for ${property.title}!`);
    } else {
      alert("Booking failed. Please check your connection.");
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesFilter = filter === 'All' || p.type === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = (p.offer ? p.discountedPrice || p.price : p.price) <= priceRange;
    
    return matchesFilter && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    const priceA = a.offer ? a.discountedPrice || a.price : a.price;
    const priceB = b.offer ? b.discountedPrice || b.price : b.price;
    
    if (sortOrder === 'price-asc') return priceA - priceB;
    if (sortOrder === 'price-desc') return priceB - priceA;
    return 0;
  });

  const categories = ['All', 'House', 'Apartment', 'Villa', 'Penthouse'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-6"
      >
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Find Your Stay</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Explore our exclusive collection of homes.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search destination..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-3 pl-12 pr-4 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 mb-8 shadow-sm"
      >
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
            
            {/* Category Filter - Scrollable on mobile */}
            <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                        filter === cat 
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-md' 
                            : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                        }`}
                    >
                        {cat}
                    </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                {/* Price Range */}
                <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-500 uppercase px-2">Max Price</span>
                    <input 
                        type="range" 
                        min="500" 
                        max="20000" 
                        step="500" 
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full sm:w-32 accent-emerald-500 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-16 text-right">${priceRange}</span>
                </div>

                {/* Sort Order */}
                <div className="relative w-full sm:w-48">
                    <select 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300 appearance-none"
                    >
                        <option value="default">Sort By: Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                    <SlidersHorizontal size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProperties.length > 0 ? (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredProperties.map((prop) => (
            <motion.div key={prop.id} className="h-[450px]" variants={itemVariants}>
                <PropertyCard property={prop} onBook={handleBook} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm"
        >
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">No properties found matching your criteria.</p>
          <button onClick={() => {setFilter('All'); setSearchTerm(''); setPriceRange(10000);}} className="mt-4 text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Clear Filters</button>
        </motion.div>
      )}
    </div>
  );
};

export default Properties;