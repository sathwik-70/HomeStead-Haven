
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPropertyById, createBooking, fetchReviews, createReview } from '../services/dataService';
import { Property, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { MapPin, Bed, Bath, Square, Share2, Heart, CheckCircle, Star, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Listing: React.FC = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const loadListing = async () => {
      if (!listingId) return;
      setLoading(true);
      
      const [propData, reviewsData] = await Promise.all([
        fetchPropertyById(listingId),
        fetchReviews(listingId)
      ]);
      
      setListing(propData || null);
      setReviews(reviewsData);
      setLoading(false);
    };
    loadListing();
  }, [listingId]);

  const handleBooking = async () => {
    if (!user) {
      alert("Please sign in to book this property.");
      return;
    }
    if (!startDate || !endDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    if (listing) {
      const result = await createBooking({
        propertyId: listing.id,
        userId: user.id,
        totalPrice: listing.offer ? listing.discountedPrice : listing.price,
        status: 'pending',
        startDate,
        endDate
      });
      
      if (result.success) {
        setBookingStatus('success');
      } else {
        setBookingStatus('error');
        setErrorMessage(result.error || "Booking failed");
      }
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !listingId) return;

    setSubmittingReview(true);
    const result = await createReview({
        propertyId: listingId,
        userId: user.id,
        rating,
        comment,
        userName: user.name,
        userAvatar: user.avatar
    });

    if (result.success) {
        const newReview: Review = {
            id: Date.now().toString(),
            propertyId: listingId,
            userId: user.id,
            rating,
            comment,
            date: new Date().toISOString(),
            userName: user.name,
            userAvatar: user.avatar
        };
        setReviews([newReview, ...reviews]);
        setComment('');
        setRating(5);
    } else {
        alert("Failed to submit review.");
    }
    setSubmittingReview(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  if (loading) return (
    <div className="min-h-screen pt-28 flex justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen pt-28 text-center text-slate-600">
      <h2 className="text-2xl font-bold">Property not found</h2>
      <Link to="/properties" className="text-emerald-600 hover:underline">Back to listings</Link>
    </div>
  );

  return (
    <main className="min-h-screen pt-32 pb-12 max-w-7xl mx-auto px-4">
      {/* Image Gallery */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[350px] md:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl mb-10 group border border-white/20 dark:border-slate-700"
      >
        <img 
          src={listing.image} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
        />
        <div className="absolute top-6 right-6 flex gap-3">
            <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-all shadow-lg ${isFavorite ? 'text-rose-500' : 'text-slate-700 hover:text-rose-500'}`}
            >
                <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur-md rounded-full hover:bg-white text-slate-700 hover:text-blue-500 transition-all shadow-lg">
                <Share2 size={22} />
            </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-700"
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{listing.title}</h1>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <MapPin size={18} className="text-emerald-500" />
                            <span>{listing.location}</span>
                        </div>
                    </div>
                    <div className="hidden md:block bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wide text-xs">{listing.type}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50">
                        <Bed size={24} className="text-emerald-500 mb-1" />
                        <span className="font-bold text-slate-800 dark:text-white">{listing.bedrooms} BHK</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50">
                        <Bath size={24} className="text-blue-500 mb-1" />
                        <span className="font-bold text-slate-800 dark:text-white">{listing.bathrooms} Baths</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50">
                        <Square size={24} className="text-cyan-500 mb-1" />
                        <span className="font-bold text-slate-800 dark:text-white">{listing.sqft} sqft</span>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Property Description</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        {listing.description}
                    </p>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-700"
            >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">World-Class Amenities</h2>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                            <CheckCircle size={18} className="text-emerald-500" />
                            <span className="font-medium">{amenity}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Reviews Section */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <Star className="text-amber-400 fill-amber-400" />
                    Resident Reviews <span className="text-slate-400 text-lg font-normal">({reviews.length})</span>
                </h2>

                {/* Write Review Form */}
                {user ? (
                    <form onSubmit={handleSubmitReview} className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl mb-10 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4">Leave a Review</h3>
                        <div className="flex items-center gap-2 mb-4">
                             {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none hover:scale-110 transition-transform"
                                >
                                    <Star 
                                        size={28} 
                                        className={`${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} 
                                    />
                                </button>
                             ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="How was your stay?"
                            className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-all mb-4 text-slate-800 dark:text-white"
                            rows={3}
                            required
                        />
                        <button 
                            disabled={submittingReview}
                            className="bg-slate-900 dark:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg"
                        >
                            {submittingReview ? "Posting..." : "Post Review"}
                        </button>
                    </form>
                ) : null}

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                key={review.id} 
                                className="pb-6 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <img src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">{review.userName || 'Verified User'}</p>
                                            <p className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 pl-14">{review.comment}</p>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-slate-400 italic text-center py-8">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar / Booking */}
        <div className="lg:col-span-1">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50 sticky top-28"
            >
                <div className="mb-8 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-1 font-medium">Price</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            ₹{formatPrice(listing.offer ? listing.discountedPrice || listing.price : listing.price)}
                        </span>
                        <span className="text-sm text-slate-500">{listing.purpose === 'rent' ? '/month' : ''}</span>
                    </div>
                </div>

                {/* Date Selection */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check-In</label>
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                      <CalendarIcon size={18} className="text-emerald-500 mr-3" />
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-sm outline-none text-slate-700 dark:text-slate-200 bg-transparent font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Check-Out</label>
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                      <CalendarIcon size={18} className="text-emerald-500 mr-3" />
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-sm outline-none text-slate-700 dark:text-slate-200 bg-transparent font-medium"
                      />
                    </div>
                  </div>
                </div>

                {bookingStatus === 'idle' ? (
                    <button 
                        onClick={handleBooking}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        Inquire Now
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : bookingStatus === 'success' ? (
                    <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100">
                        <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2" />
                        <p className="text-emerald-800 dark:text-emerald-300 font-bold">Request Sent!</p>
                        <p className="text-xs text-emerald-600 mt-1">Our specialist will contact you shortly.</p>
                    </div>
                ) : (
                    <div className="text-center p-6 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100">
                        <p className="text-rose-700 font-bold">Inquiry Failed</p>
                        <button onClick={() => setBookingStatus('idle')} className="text-xs text-rose-500 underline mt-2">Try Again</button>
                    </div>
                )}
            </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Listing;
