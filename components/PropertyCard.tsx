import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ArrowRight, Sparkles } from 'lucide-react';
import { Property } from '../types';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  onBook?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-100, 100], [2, -2]); 
  const rotateY = useTransform(mouseX, [-100, 100], [-2, 2]);

  const handleViewDetails = () => {
    navigate(`/listing/${property.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumSignificantDigits: 3,
    }).format(price);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative w-full h-full group"
    >
        <div 
          onClick={handleViewDetails}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/40 dark:shadow-black/40 border border-white/50 dark:border-slate-700/50 cursor-pointer h-full flex flex-col transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-emerald-500/10 group-hover:border-emerald-500/30"
        >
            {/* Image Container */}
            <div className="relative h-[260px] w-full overflow-hidden">
                <motion.div
                    className="h-full w-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <img 
                        src={property.image} 
                        alt={property.title} 
                        className="h-full w-full object-cover"
                    />
                </motion.div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-50 transition-opacity"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {property.offer && (
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                        <Sparkles size={12} /> Offer
                    </div>
                    )}
                    <div className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                        {property.type}
                    </div>
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                     <p className="text-[10px] font-bold text-slate-300 mb-0.5 uppercase tracking-wider opacity-80">Monthly Rent</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold tracking-tight">
                            ₹{formatPrice(property.offer ? property.discountedPrice || property.price : property.price)}
                        </span>
                        {property.offer && (
                            <span className="text-sm text-slate-300 line-through decoration-emerald-400 decoration-2 opacity-80">₹{formatPrice(property.price)}</span>
                        )}
                     </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="p-6 flex flex-col gap-4 flex-grow relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[220px]">{property.location}</p>
                    </div>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-900/20 transition-colors">
                    <Bed size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors mb-1" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{property.bedrooms} BHK</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-900/20 transition-colors">
                    <Bath size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors mb-1" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-900/20 transition-colors">
                    <Square size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors mb-1" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{property.sqft} sqft</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-2">
                  <button 
                      onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
                      className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-emerald-500 text-white text-sm rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group/btn"
                  >
                      View Details
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
            </div>
        </div>
    </motion.div>
  );
};

export default PropertyCard;