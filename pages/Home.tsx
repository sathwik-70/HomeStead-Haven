import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties, createBooking } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Property } from '../types';
import { Search, ArrowRight, ShieldCheck, Zap, Globe, Smartphone, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [offerListings, setOfferListings] = useState<Property[]>([]);
  const [saleListings, setSaleListings] = useState<Property[]>([]);
  const [rentListings, setRentListings] = useState<Property[]>([]);
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProperties();
      setOfferListings(data.filter(p => p.offer).slice(0, 4));
      setRentListings(data.filter(p => p.purpose === 'rent').slice(0, 4));
      setSaleListings(data.filter(p => p.purpose === 'sale').slice(0, 4));
    };
    loadData();
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

  const features = [
    { icon: Globe, title: "Global Reach", desc: "Access properties in over 120 countries with local insights.", color: "bg-blue-50 text-blue-600" },
    { icon: ShieldCheck, title: "Verified Listings", desc: "Every home is physically verified for quality and authenticity.", color: "bg-emerald-50 text-emerald-600" },
    { icon: Zap, title: "Instant Booking", desc: "Secure your dream stay in seconds with our smart booking engine.", color: "bg-amber-50 text-amber-600" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 overflow-x-hidden bg-gradient-to-br from-emerald-50/60 via-transparent to-blue-50/60 dark:from-emerald-950/30 dark:via-transparent dark:to-blue-950/30">
      
      {/* 3D Creative Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        {/* Hero content - Background handled by App.tsx */}
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                
                {/* Text Content */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 text-center lg:text-left w-full"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm mb-6 mx-auto lg:mx-0">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase">No. 1 Real Estate Platform</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
                        Discover a place <br className="hidden sm:block"/>
                        you'll love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">live</span>
                    </h1>
                    
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0">
                        Explore our curated collection of over 50,000+ premium properties. 
                        From modern city lofts to serene countryside villas, find your sanctuary.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start w-full sm:w-auto px-4 sm:px-0">
                        <Link 
                            to="/properties" 
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                            Start Exploring <ArrowRight size={20} />
                        </Link>
                        <Link 
                            to="/create-listing" 
                            className="w-full sm:w-auto px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all text-center"
                        >
                            List Property
                        </Link>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-3 gap-4 lg:flex lg:items-center lg:justify-start lg:gap-8 border-t border-slate-200/50 dark:border-slate-700/50 lg:border-none pt-6 lg:pt-0">
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">12k+</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Listings</p>
                        </div>
                        <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">8k+</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Customers</p>
                        </div>
                        <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">120+</p>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Awards</p>
                        </div>
                    </div>
                </motion.div>

                {/* 3D Floating Mockup */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="flex-1 relative w-full max-w-[350px] sm:max-w-[500px] lg:max-w-[600px] perspective-1000 mt-8 lg:mt-0"
                >
                    {/* Main Card */}
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/40 dark:border-slate-700/40 rotate-y-6 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out"
                    >
                         <img 
                            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop" 
                            alt="Hero Home" 
                            className="w-full h-[250px] sm:h-[350px] object-cover rounded-2xl"
                         />
                         <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-lg flex items-center justify-between border border-white/20">
                            <div>
                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Featured</p>
                                <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none">Modern Villa</h3>
                            </div>
                            <div className="bg-emerald-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-sm sm:text-base">
                                $4,500
                            </div>
                         </div>
                    </motion.div>

                    {/* Floating Bubble 1 */}
                    <motion.div 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-6 -right-4 sm:-top-10 sm:-right-10 z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 w-40 sm:w-48 scale-90 sm:scale-100"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Verified</p>
                                <p className="text-[10px] sm:text-xs text-slate-500">Trust & Safety</p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                        </div>
                    </motion.div>

                    {/* Floating Bubble 2 */}
                    <motion.div 
                         animate={{ y: [0, 20, 0] }}
                         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                         className="absolute -bottom-6 -left-4 sm:-bottom-10 sm:-left-10 z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 flex items-center gap-4 scale-90 sm:scale-100"
                    >
                        <div className="flex -space-x-3">
                            <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-slate-800" alt="" />
                            <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-slate-800" alt="" />
                            <img src="https://i.pravatar.cc/100?img=3" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-slate-800" alt="" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">1k+ New</p>
                            <p className="text-[10px] sm:text-xs text-slate-500">Daily Visitors</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* Features & Mockup Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden border-y border-white/20 dark:border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                  
                  {/* Left: Content */}
                  <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      >
                          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">Experience the future of <br/> home renting</h2>
                          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed">We've reimagined how you find your next home. With AI-driven recommendations, virtual tours, and instant booking, HomeStead Haven puts the power in your hands.</p>
                      </motion.div>

                      <div className="space-y-6">
                          {features.map((feature, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors group cursor-default"
                              >
                                  <div className={`w-12 h-12 shrink-0 ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                                      <feature.icon size={24} />
                                  </div>
                                  <div>
                                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                  </div>

                  {/* Right: Phone Mockup Animation */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 relative"
                  >
                      {/* CSS-Only Phone Mockup */}
                      <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
                          <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
                          <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                          <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                          <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                          <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                          
                          {/* Screen Content */}
                          <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-50 dark:bg-slate-900 relative">
                               {/* Fake App UI */}
                               <div className="absolute top-0 w-full h-40 bg-gradient-to-br from-emerald-500 to-teal-500 p-6 pt-12 text-white">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                    </div>
                                    <div className="h-4 w-2/3 bg-white/30 rounded-full mb-3"></div>
                                    <div className="h-8 w-full bg-white/20 rounded-xl"></div>
                               </div>

                               <div className="absolute top-36 w-full p-4 space-y-4">
                                    {/* Mock Cards */}
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-3">
                                            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0"></div>
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="h-4 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-md"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                               </div>

                               {/* Floating Map Pin */}
                               <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute bottom-20 right-6 bg-emerald-500 p-3 rounded-full text-white shadow-lg shadow-emerald-500/30"
                               >
                                   <MapPin size={24} />
                               </motion.div>
                          </div>
                      </div>
                      
                      {/* Decorative blobs behind phone */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* Listings Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col gap-12 sm:gap-20 relative">
        
        {/* Helper component for sections */}
        {[
            { title: "Special Offers", subtitle: "Exclusive deals selected just for you", data: offerListings, link: "/properties" },
            { title: "Latest Rentals", subtitle: "Curated rental homes for every lifestyle", data: rentListings, link: "/properties" },
            { title: "Properties for Sale", subtitle: "Invest in your future with these premium picks", data: saleListings, link: "/properties" }
        ].map((section, idx) => (
            section.data && section.data.length > 0 && (
                <motion.div 
                    key={idx}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <div className="flex justify-between items-end mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">{section.subtitle}</p>
                        </div>
                        <Link className="hidden sm:flex px-6 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur text-slate-900 dark:text-white rounded-full font-semibold hover:bg-emerald-500 hover:text-white transition-all items-center gap-2 text-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500" to={section.link}>
                            View all <ArrowRight size={16} />
                        </Link>
                    </div>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                        variants={containerVariants}
                    >
                        {section.data.map((listing) => (
                            <motion.div key={listing.id} className="h-[420px] sm:h-[450px]" variants={itemVariants}>
                                <PropertyCard property={listing} onBook={handleBook} />
                            </motion.div>
                        ))}
                    </motion.div>
                    {/* Mobile View All Button */}
                    <div className="mt-6 sm:hidden">
                        <Link className="w-full flex justify-center px-6 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-emerald-500 hover:text-white transition-all items-center gap-2 text-sm border border-slate-200 dark:border-slate-700" to={section.link}>
                            View all {section.title} <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            )
        ))}
      </div>

      {/* Call to Action */}
      <section className="bg-slate-900 dark:bg-emerald-900 py-16 sm:py-20 mt-10 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to find your dream home?</h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">Join thousands of satisfied users who found their perfect match on HomeStead Haven today.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/properties" className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/30 w-full sm:w-auto text-center">
                      Browse Properties
                  </Link>
                  <Link to="/sign-up" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
                      Create Account
                  </Link>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Home;