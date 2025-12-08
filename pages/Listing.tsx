import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPropertyById, createBooking, fetchReviews, createReview } from '../services/dataService';
import { Property, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { MapPin, Bed, Bath, Square, Share2, Heart, CheckCircle, Star, User, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Listing: React.FC = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Booking Dates
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Review Form State
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
    <main className="min-h-screen pt-24 pb-12 max-w-6xl mx-auto px-4">
      {/* Image Gallery */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg mb-8 group"
      >
        <img 
          src={listing.image} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute top-4 right-4 flex gap-3">
            <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors ${isFavorite ? 'text-rose-500' : 'text-slate-700 hover:text-rose-500'}`}
            >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white text-slate-700 hover:text-blue-500 transition-colors">
                <Share2 size={20} />
            </button>
        </div>
        {listing.offer && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-1.5 rounded-full font-bold shadow-lg">
                OFFER
            </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{listing.title}</h1>
                <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={18} className="text-emerald-500" />
                    <span>{listing.location}</span>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-6 py-4 border-y border-slate-100"
            >
                <div className="flex items-center gap-2 text-slate-700">
                    <Bed size={20} className="text-emerald-500" />
                    <span className="font-semibold">{listing.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                    <Bath size={20} className="text-blue-500" />
                    <span className="font-semibold">{listing.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                    <Square size={20} className="text-cyan-500" />
                    <span className="font-semibold">{listing.sqft} sqft</span>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
            >
                <h2 className="text-xl font-bold text-slate-800">About this home</h2>
                <p className="text-slate-600 leading-relaxed">
                    {listing.description}
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
            >
                <h2 className="text-xl font-bold text-slate-800">Amenities</h2>
                <ul className="grid grid-cols-2 gap-2">
                    {listing.amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-600">
                            <CheckCircle size={16} className="text-emerald-500" />
                            {amenity}
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Reviews Section */}
            <div className="pt-6 border-t border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Star className="text-amber-400 fill-amber-400" />
                    Reviews ({reviews.length})
                </h2>

                {/* Write Review Form */}
                {user ? (
                    <form onSubmit={handleSubmitReview} className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-200">
                        <h3 className="font-semibold text-slate-700 mb-3">Leave a review</h3>
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
                                        className={`${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                                    />
                                </button>
                             ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 mb-3"
                            rows={3}
                            required
                        />
                        <button 
                            disabled={submittingReview}
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
                        >
                            {submittingReview ? "Posting..." : "Post Review"}
                        </button>
                    </form>
                ) : (
                    <div className="bg-slate-50 p-4 rounded-xl mb-8 text-center border border-slate-100">
                        <p className="text-slate-500">Please <Link to="/sign-in" className="text-emerald-600 font-bold hover:underline">sign in</Link> to leave a review.</p>
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                key={review.id} 
                                className="border-b border-slate-100 pb-6 last:border-0"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                            <img src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{review.userName || 'User'}</p>
                                            <p className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600">{review.comment}</p>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-slate-400 italic">No reviews yet. Be the first!</p>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar / Booking */}
        <div className="md:col-span-1">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-28"
            >
                <div className="mb-6">
                    <p className="text-slate-500 text-sm mb-1">{listing.type} for {listing.purpose}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">
                            ${listing.offer ? listing.discountedPrice : listing.price}
                        </span>
                        <span className="text-slate-500">/ month</span>
                    </div>
                    {listing.offer && (
                        <p className="text-sm text-emerald-600 mt-1 font-medium">
                            You save ${listing.price - (listing.discountedPrice || 0)}
                        </p>
                    )}
                </div>

                {/* Date Selection */}
                <div className="mb-4 space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Check-In</label>
                    <div className="flex items-center border border-slate-200 rounded-lg p-2 focus-within:border-emerald-500 transition-colors">
                      <CalendarIcon size={16} className="text-slate-400 mr-2" />
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-sm outline-none text-slate-700"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Check-Out</label>
                    <div className="flex items-center border border-slate-200 rounded-lg p-2 focus-within:border-emerald-500 transition-colors">
                      <CalendarIcon size={16} className="text-slate-400 mr-2" />
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-sm outline-none text-slate-700"
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                {bookingStatus === 'idle' ? (
                    <button 
                        onClick={handleBooking}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95"
                    >
                        Book Now
                    </button>
                ) : bookingStatus === 'success' ? (
                    <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-emerald-700 font-bold mb-2">Request Sent!</p>
                        <p className="text-xs text-emerald-600 mb-2">Host has been notified.</p>
                        <Link to="/profile" className="text-sm text-emerald-600 hover:underline">View in Dashboard</Link>
                    </div>
                ) : (
                    <div className="text-center p-4 bg-rose-50 rounded-xl border border-rose-100">
                        <p className="text-rose-700 font-bold mb-2">Booking Failed</p>
                        <p className="text-xs text-rose-600 mb-3">{errorMessage}</p>
                        <button onClick={() => setBookingStatus('idle')} className="text-xs underline text-rose-700">Try Again</button>
                    </div>
                )}
                
                <p className="text-center text-xs text-slate-400 mt-4">
                    You won't be charged yet.
                </p>
            </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Listing;