import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ArrowRight, Sparkles } from 'lucide-react';
import { Property } from '../types';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  onBook?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onBook }) => {
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

  const rotateX = useTransform(mouseY, [-100, 100], [3, -3]);
  const rotateY = useTransform(mouseX, [-100, 100], [-3, 3]);

  const handleViewDetails = () => {
    navigate(`/listing/${property.id}`);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative w-full h-full"
    >
        <div 
          onClick={handleViewDetails}
          className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 cursor-pointer h-full flex flex-col group transition-all duration-300"
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {property.offer && (
                    <div className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles size={12} /> OFFER
                    </div>
                    )}
                    <div className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                        {property.type}
                    </div>
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                     <p className="text-xs font-medium text-slate-300 mb-0.5 uppercase tracking-wide">Price</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold tracking-tight">
                            ${property.offer ? property.discountedPrice : property.price}
                        </span>
                        {property.offer && (
                            <span className="text-sm text-slate-400 line-through decoration-emerald-500/50 decoration-2">${property.price}</span>
                        )}
                        <span className="text-sm text-slate-300 font-normal">
                             {property.type !== 'Villa' && property.type !== 'House' ? '/mo' : ''}
                        </span>
                     </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="p-6 flex flex-col gap-4 flex-grow relative bg-white dark:bg-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{property.location}</p>
                    </div>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-50 dark:border-slate-700/50">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <Bed size={18} className="text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <Bath size={18} className="text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <Square size={18} className="text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{property.sqft} sqft</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-2">
                  <button 
                      onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
                      className="w-full py-3 bg-slate-900 dark:bg-emerald-600 text-white text-sm rounded-xl font-semibold hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 group/btn"
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