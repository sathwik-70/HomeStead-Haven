
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
    { icon: Globe, title: "Global Reach", desc: "Access properties in over 120 countries with local insights.", color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { icon: ShieldCheck, title: "Verified Listings", desc: "Every home is physically verified for quality and authenticity.", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
    { icon: Zap, title: "Instant Booking", desc: "Secure your dream stay in seconds with our smart booking engine.", color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 overflow-x-hidden">
      
      {/* 3D Creative Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              
              {/* Text Content */}
              <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex-1 text-center lg:text-left"
              >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase">No. 1 Indian Real Estate Platform</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                      Discover a place <br className="hidden sm:block"/>
                      you'll love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">live</span>
                  </h1>
                  
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                      Explore our curated collection of premium Indian properties. 
                      From modern city lofts to serene countryside villas, find your sanctuary.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
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
                  <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-4 lg:flex lg:items-center lg:justify-start lg:gap-8 border-t border-slate-200/50 dark:border-slate-700/50 pt-8 lg:border-none lg:pt-0">
                      <div>
                          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">12k+</p>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Listings</p>
                      </div>
                      <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
                      <div>
                          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">8k+</p>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Customers</p>
                      </div>
                      <div className="hidden lg:block w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
                      <div>
                          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">120+</p>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Awards</p>
                      </div>
                  </div>
              </motion.div>

              {/* 3D Floating Mockup */}
              <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="flex-1 relative w-full max-w-[320px] sm:max-w-[450px] lg:max-w-[550px] mt-8 lg:mt-0"
              >
                  {/* Main Card */}
                  <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/40 dark:border-slate-700/40"
                  >
                       <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-700 rounded-2xl overflow-hidden relative">
                          <img 
                              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop" 
                              alt="Luxury Villa" 
                              className="w-full h-full object-cover"
                          />
                       </div>
                       <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-lg flex items-center justify-between border border-white/20">
                          <div className="min-w-0">
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Featured</p>
                              <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white truncate">Elite Sky Villa</h3>
                          </div>
                          <div className="shrink-0 bg-emerald-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-sm sm:text-base">
                              ₹4.5L
                          </div>
                       </div>
                  </motion.div>

                  {/* Floating Elements - Hidden on small mobile to avoid clutter */}
                  <motion.div 
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="hidden sm:block absolute -top-8 -right-8 z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 w-40"
                  >
                      <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                              <ShieldCheck size={18} />
                          </div>
                          <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Verified</p>
                              <p className="text-[10px] text-slate-500">Physical Check</p>
                          </div>
                      </div>
                      <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-full rounded-full"></div>
                      </div>
                  </motion.div>

                  <motion.div 
                       animate={{ y: [0, 15, 0] }}
                       transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                       className="hidden sm:flex absolute -bottom-8 -left-8 z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700 items-center gap-3"
                  >
                      <div className="flex -space-x-3">
                          <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800" alt="" />
                          <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800" alt="" />
                      </div>
                      <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">1k+ Live</p>
                          <p className="text-[10px] text-slate-500">Viewers</p>
                      </div>
                  </motion.div>
              </motion.div>
          </div>
      </section>

      {/* Features & Mockup Section */}
      <section className="py-20 bg-white/30 dark:bg-slate-900/40 backdrop-blur-sm border-y border-white/20 dark:border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                  
                  {/* Left: Content */}
                  <div className="flex-1 w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center lg:text-left"
                      >
                          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">Experience the future of Indian home renting</h2>
                          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg mb-10 leading-relaxed">We've reimagined how you find your next sanctuary. With AI-driven insights and verified listings, HomeStead Haven puts the power back in your hands.</p>
                      </motion.div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                          {features.map((feature, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-4 p-5 rounded-2xl bg-white/40 dark:bg-slate-800/20 border border-white/40 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-800/40 transition-colors"
                              >
                                  <div className={`w-12 h-12 shrink-0 ${feature.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                                      <feature.icon size={24} />
                                  </div>
                                  <div>
                                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                  </div>

                  {/* Right: Phone Mockup */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex-1 relative flex justify-center w-full"
                  >
                      <div className="relative border-gray-800 bg-gray-800 border-[10px] sm:border-[14px] rounded-[2rem] sm:rounded-[2.5rem] h-[500px] sm:h-[600px] w-[250px] sm:w-[300px] shadow-2xl">
                          <div className="w-[120px] sm:w-[148px] h-[16px] sm:h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
                          <div className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden w-full h-full bg-slate-50 dark:bg-slate-900 relative">
                               <div className="absolute top-0 w-full h-32 sm:h-40 bg-gradient-to-br from-emerald-500 to-teal-500 p-4 sm:p-6 pt-10 sm:pt-12">
                                    <div className="h-3 w-2/3 bg-white/30 rounded-full mb-3"></div>
                                    <div className="h-6 w-full bg-white/20 rounded-lg"></div>
                               </div>
                               <div className="absolute top-28 sm:top-36 w-full p-3 sm:p-4 space-y-3 sm:space-y-4">
                                    {[
                                      { img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=200&fit=crop", title: "Modern Villa" },
                                      { img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200&h=200&fit=crop", title: "Sky Loft" }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-800 p-2 sm:p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-3">
                                            <img src={item.img} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover" alt={item.title} />
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                                                <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                                            </div>
                                        </div>
                                    ))}
                               </div>
                          </div>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* Listings Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-16">
        {[
            { title: "Special Offers", subtitle: "Handpicked premium deals", data: offerListings },
            { title: "Latest Rentals", subtitle: "Luxury living on subscription", data: rentListings },
            { title: "Properties for Sale", subtitle: "Invest in your legacy", data: saleListings }
        ].map((section, idx) => (
            section.data && section.data.length > 0 && (
                <motion.div 
                    key={idx}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                >
                    <div className="flex justify-between items-end mb-8">
                        <div className="max-w-md">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">{section.subtitle}</p>
                        </div>
                        <Link className="hidden sm:flex px-6 py-2 bg-emerald-500 text-white rounded-full font-bold hover:bg-emerald-600 transition-all items-center gap-2 text-sm shadow-lg shadow-emerald-500/20" to="/properties">
                            Explore All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                        {section.data.map((listing) => (
                            <motion.div key={listing.id} className="min-h-[420px]" variants={itemVariants}>
                                <PropertyCard property={listing} onBook={handleBook} />
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-8 sm:hidden">
                        <Link className="w-full flex justify-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold items-center gap-2 text-sm" to="/properties">
                            Explore All {section.title} <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            )
        ))}
      </div>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-emerald-900/60 dark:to-teal-950/60 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)]"></div>
              <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to find your dream sanctuary?</h2>
                  <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto">Join the elite community of HomeStead Haven and experience luxury like never before.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link to="/properties" className="px-10 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/30">
                          Browse Listings
                      </Link>
                      <Link to="/sign-up" className="px-10 py-4 bg-white/10 text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md">
                          Create Account
                      </Link>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Home;
