import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserBookings, fetchUserListings, deleteListing, fetchPropertyById } from '../services/dataService';
import { Booking, Property } from '../types';
import { Trash2, Building, Calendar, Edit, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ username: '', email: '', avatar: '' });
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('bookings');
  const [userListings, setUserListings] = useState<Property[]>([]);
  const [userBookings, setUserBookings] = useState<(Booking & { propertyTitle?: string })[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
        setFormData({ username: user.name, email: user.email, avatar: user.avatar });
        loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    // Load Listings by User ID
    const listings = await fetchUserListings(user.id);
    setUserListings(listings);

    // Load Bookings
    const bookings = await fetchUserBookings(user.id);
    const enrichedBookings = await Promise.all(bookings.map(async (b) => {
        const prop = await fetchPropertyById(b.propertyId);
        return { ...b, propertyTitle: prop?.title || 'Unknown Property' };
    }));
    setUserBookings(enrichedBookings);
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/sign-in');
  };

  const handleDeleteListing = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
        const success = await deleteListing(id);
        if (success) {
            setUserListings(prev => prev.filter(item => item.id !== id));
        }
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto pt-24 md:pt-28 pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Profile Card */}
        <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm text-center sticky top-28">
                <div className="relative inline-block mb-4">
                    <img 
                        src={formData.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                        alt="profile" 
                        className="rounded-full h-24 w-24 md:h-32 md:w-32 object-cover border-4 border-emerald-100 dark:border-emerald-900 mx-auto shadow-md"
                    />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{formData.username}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 truncate">{formData.email}</p>

                <div className="flex flex-col gap-3">
                    <Link 
                        className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-3 rounded-xl uppercase font-semibold hover:shadow-lg transition-all text-sm" 
                        to={"/create-listing"}
                    >
                        Create Listing
                    </Link>
                    <button onClick={handleSignOut} className="flex items-center justify-center gap-2 text-rose-500 font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-xl transition-colors text-sm">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="w-full lg:w-2/3">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`flex-1 py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'bookings' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        <Calendar size={18} /> <span className="hidden sm:inline">My Bookings</span> <span className="sm:hidden">Bookings</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('listings')}
                        className={`flex-1 py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'listings' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                    >
                        <Building size={18} /> <span className="hidden sm:inline">My Listings</span> <span className="sm:hidden">Listings</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {activeTab === 'bookings' && (
                        <div className="space-y-4">
                            {userBookings.length === 0 ? (
                                <div className="text-center py-10">
                                    <Calendar size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                                    <p className="text-slate-400 dark:text-slate-500">No bookings found yet.</p>
                                    <Link to="/properties" className="text-emerald-500 font-semibold text-sm mt-2 inline-block">Explore Properties</Link>
                                </div>
                            ) : (
                                userBookings.map((booking) => (
                                    <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow gap-3 bg-slate-50 dark:bg-slate-800/50">
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">{booking.propertyTitle}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Date: {new Date(booking.date).toLocaleDateString()}</p>
                                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">${booking.totalPrice}</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                                             <span className="text-xs text-slate-400 sm:hidden">Status:</span>
                                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'listings' && (
                        <div className="space-y-4">
                            {userListings.length === 0 ? (
                                <div className="text-center py-10">
                                    <Building size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                                    <p className="text-slate-400 dark:text-slate-500">You haven't listed any properties yet.</p>
                                    <Link to="/create-listing" className="text-blue-500 font-semibold text-sm mt-2 inline-block">Create your first listing</Link>
                                </div>
                            ) : (
                                userListings.map((listing) => (
                                    <div key={listing.id} className="flex items-center gap-3 sm:gap-4 p-3 border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow group bg-slate-50 dark:bg-slate-800/50">
                                        <img src={listing.image} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-slate-200" />
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/listing/${listing.id}`} className="font-bold text-slate-800 dark:text-white hover:text-blue-600 text-sm sm:text-base truncate block">
                                                {listing.title}
                                            </Link>
                                            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">${listing.price}<span className="text-slate-400 font-normal text-xs">/mo</span></p>
                                            <p className="text-xs text-slate-400 truncate mt-0.5 hidden sm:block">{listing.location}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Link 
                                                to={`/edit-listing/${listing.id}`}
                                                className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-500 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteListing(listing.id)}
                                                className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-rose-500 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;