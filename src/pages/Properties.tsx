
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Filter, X } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties, createBooking } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Property } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Properties: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(1000000); 
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
      if (confirm("Sign in to continue?")) {
        signInWithGoogle();
      }
      return;
    }
    await createBooking({ propertyId: property.id, userId: user.id, totalPrice: property.price, status: 'pending', date: new Date().toISOString() });
    alert("Inquiry sent!");
  };

  const filteredProperties = properties.filter(p => {
    const matchesFilter = filter === 'All' || p.type === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const currentPrice = p.offer ? p.discountedPrice || p.price : p.price;
    const matchesPrice = currentPrice <= priceRange;
    
    return matchesFilter && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    const priceA = a.offer ? a.discountedPrice || a.price : a.price;
    const priceB = b.offer ? b.discountedPrice || b.price : b.price;
    
    if (sortOrder === 'price-asc') return priceA - priceB;
    if (sortOrder === 'price-desc') return priceB - priceA;
    return 0;
  });

  const categories = ['All', 'House', 'Apartment', 'Villa', 'Penthouse'];
  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN').format(price);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div className="max-w-xl">
           <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Discover Premium Stays</h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">Elite residences across India's most iconic locations.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-96 group">
          <input 
            type="text" 
            placeholder="Search city, area or title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5 mb-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            
            {/* Category Filter - Scrollable on mobile */}
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                    {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        filter === cat 
                            ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-lg' 
                            : 'bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        {cat}
                    </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                {/* Price Filter */}
                <div className="flex items-center gap-4 w-full sm:w-auto bg-slate-100 dark:bg-slate-900/40 p-2.5 rounded-xl border border-transparent dark:border-slate-800/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Max Price</span>
                    <input 
                        type="range" 
                        min="10000" 
                        max="1000000" 
                        step="10000" 
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full sm:w-32 accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 w-24 text-right">₹{formatPrice(priceRange)}</span>
                </div>

                {/* Sort */}
                <div className="relative w-full sm:w-48">
                    <select 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="w-full p-2.5 bg-slate-100 dark:bg-slate-900/40 border border-transparent dark:border-slate-800/50 rounded-xl text-sm font-bold focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
                    >
                        <option value="default">Sort: Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                    <SlidersHorizontal size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-80 gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Searching Haven...</p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProperties.map((prop) => (
            <div key={prop.id} className="min-h-[450px]">
                <PropertyCard property={prop} onBook={handleBook} />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white/40 dark:bg-slate-800/20 backdrop-blur-md rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <Filter size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-6" />
          <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">No matches found for your search.</p>
          <button onClick={() => {setFilter('All'); setSearchTerm(''); setPriceRange(1000000);}} className="mt-4 text-emerald-500 font-bold hover:underline uppercase tracking-widest text-xs">Clear all filters</button>
        </motion.div>
      )}
    </div>
  );
};

export default Properties;
