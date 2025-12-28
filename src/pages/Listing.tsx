
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPropertyById, createBooking, fetchReviews, createReview } from '../services/dataService';
import { Property, Review } from '../types';
import { useAuth } from '../context/AuthContext';
// Added missing Smartphone icon to imports
import { MapPin, Bed, Bath, Square, Share2, Heart, CheckCircle, Star, Calendar as CalendarIcon, ArrowRight, Smartphone } from 'lucide-react';
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
    <div className="min-h-screen pt-40 flex justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen pt-40 text-center text-slate-600">
      <h2 className="text-2xl font-bold">Property not found</h2>
      <Link to="/properties" className="text-emerald-600 hover:underline">Back to listings</Link>
    </div>
  );

  return (
    <main className="min-h-screen pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Image Gallery */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative aspect-video sm:aspect-auto sm:h-[450px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl mb-8 group border border-white/20 dark:border-slate-800"
      >
        <img 
          src={listing.image} 
          alt={listing.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2 sm:gap-3">
            <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 sm:p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full transition-all shadow-lg ${isFavorite ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}
            >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="p-2 sm:p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-slate-700 dark:text-slate-200 shadow-lg">
                <Share2 size={20} />
            </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/40 dark:border-slate-700/50 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 break-words">{listing.title}</h1>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <MapPin size={18} className="text-emerald-500 shrink-0" />
                            <span className="text-sm sm:text-base">{listing.location}</span>
                        </div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800 shrink-0">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wide text-[10px] sm:text-xs">{listing.type}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 py-6 border-y border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                        <Bed size={20} className="text-emerald-500 mb-1" />
                        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{listing.bedrooms} BHK</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                        <Bath size={20} className="text-blue-500 mb-1" />
                        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{listing.bathrooms} Baths</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                        <Square size={20} className="text-cyan-500 mb-1" />
                        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">{listing.sqft} sqft</span>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Description</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                        {listing.description}
                    </p>
                </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/40 dark:border-slate-700/50 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Premium Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-white/20">
                            <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                            <span className="text-sm font-medium">{amenity}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/40 dark:border-slate-700/50 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <Star className="text-amber-400 fill-amber-400" />
                    Resident Feedback <span className="text-slate-400 text-lg font-normal">({reviews.length})</span>
                </h2>

                {user && (
                    <form onSubmit={handleSubmitReview} className="bg-slate-50/50 dark:bg-slate-900/50 p-5 sm:p-6 rounded-2xl mb-10 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base mb-4">How was your visit?</h3>
                        <div className="flex items-center gap-2 mb-4">
                             {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none"
                                >
                                    <Star 
                                        size={24} 
                                        className={`${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} 
                                    />
                                </button>
                             ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm transition-all mb-4"
                            rows={3}
                            required
                        />
                        <button 
                            disabled={submittingReview}
                            className="w-full sm:w-auto px-8 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                        >
                            {submittingReview ? "Posting..." : "Post Review"}
                        </button>
                    </form>
                )}

                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <img src={review.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{review.userName}</p>
                                        <p className="text-[10px] text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm pl-13 sm:pl-14">{review.comment}</p>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-center text-slate-400 italic text-sm py-4">No feedback yet. Be the first to review!</p>}
                </div>
            </div>
        </div>

        {/* Sidebar / Booking */}
        <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl sticky top-28">
                <div className="mb-8">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Pricing</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            ₹{formatPrice(listing.offer ? listing.discountedPrice || listing.price : listing.price)}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{listing.purpose === 'rent' ? '/month' : ''}</span>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Check-In Date</label>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                      <CalendarIcon size={18} className="text-emerald-500 shrink-0 mr-3" />
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-sm outline-none bg-transparent text-slate-700 dark:text-slate-200"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Check-Out Date</label>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                      <CalendarIcon size={18} className="text-emerald-500 shrink-0 mr-3" />
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-sm outline-none bg-transparent text-slate-700 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {bookingStatus === 'idle' ? (
                    <button 
                        onClick={handleBooking}
                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/20"
                    >
                        Send Inquiry
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : bookingStatus === 'success' ? (
                    <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                        <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2" />
                        <p className="text-emerald-800 dark:text-emerald-300 font-bold">Request Sent!</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Our agent will call you shortly.</p>
                    </div>
                ) : (
                    <div className="text-center p-6 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800">
                        <p className="text-rose-700 dark:text-rose-300 font-bold text-sm">Failed to send request</p>
                        <button onClick={() => setBookingStatus('idle')} className="text-[10px] text-rose-500 dark:text-rose-400 underline mt-2 font-bold uppercase tracking-wider">Try Again</button>
                    </div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                             <Smartphone size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Need help?</p>
                            <a href="mailto:support@homestead.in" className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Chat with an Expert</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default Listing;
