
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createListing, uploadPropertyImage } from '../services/dataService';
import { motion } from 'framer-motion';
import { Property } from '../types';
import { UploadCloud } from 'lucide-react';

const CreateListing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    regularPrice: 0,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: 'rent',
    offer: false,
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.checked });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const localUrl = URL.createObjectURL(file);
        setPreviewImage(localUrl);
        setUploading(true);
        const publicUrl = await uploadPropertyImage(file);
        setUploading(false);
        if (publicUrl) {
            setFormData({ ...formData, image: publicUrl });
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Quality Check
    if (formData.regularPrice < 1000) {
      setError("Price must be at least ₹1,000");
      return;
    }

    setLoading(true);
    setError(null);
    
    const listingData: Partial<Property> = {
        title: formData.title,
        description: formData.description,
        location: formData.address,
        price: Number(formData.regularPrice),
        offer: formData.offer,
        discountedPrice: Number(formData.discountPrice),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        amenities: [
            formData.furnished ? 'Furnished' : '',
            formData.parking ? 'Parking' : ''
        ].filter(Boolean),
        type: (formData.type === 'rent' ? 'Apartment' : 'House') as Property['type'],
        purpose: formData.type as Property['purpose'],
        image: formData.image || 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1000&auto=format&fit=crop',
        rating: 0,
        userId: user.id
    };

    const res = await createListing(listingData);
    setLoading(false);
    if (res.success) {
        navigate('/profile');
    } else {
        setError(res.error || 'Failed to create listing');
    }
  };

  return (
    <div className="p-3 max-w-4xl mx-auto pt-28 pb-20">
      <h1 className="text-3xl font-bold text-center my-7 text-slate-800 dark:text-white">List Your Property</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Property Title (e.g., Luxury 3BHK in Worli)"
            className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-slate-800 dark:border-slate-700"
            id="title"
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            placeholder="Describe your property (e.g., Sea view, high floor...)"
            className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-32 dark:bg-slate-800 dark:border-slate-700"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Full Address (e.g., Bandra West, Mumbai)"
            className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:bg-slate-800 dark:border-slate-700"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="sale" className="w-5 h-5 accent-emerald-500" 
                checked={formData.type === 'sale'} 
                onChange={() => setFormData({...formData, type: 'sale'})} 
              />
              <span className="text-slate-700 dark:text-slate-300">Sell</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="rent" className="w-5 h-5 accent-emerald-500" 
                checked={formData.type === 'rent'} 
                onChange={() => setFormData({...formData, type: 'rent'})} 
              />
              <span className="text-slate-700 dark:text-slate-300">Rent</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none w-20 dark:bg-slate-800 dark:border-slate-700"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p className="text-slate-600 dark:text-slate-400">BHK</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1000"
                required
                className="p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none w-36 dark:bg-slate-800 dark:border-slate-700"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col">
                <p className="text-slate-600 dark:text-slate-400">Price</p>
                <span className="text-xs text-slate-400">(₹ INR)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Property Image:</p>
          <div className="flex gap-4">
            <input onChange={handleImageChange} className="hidden" type="file" id="images" accept="image/*" />
            <label htmlFor="images" className={`p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl w-full text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-400 cursor-pointer text-center flex flex-col items-center gap-2 transition-all`}>
                <UploadCloud size={32} />
                {uploading ? 'Uploading...' : 'Click to Upload Hero Image'}
            </label>
          </div>
          {previewImage && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
          )}
          <button disabled={loading || uploading} className="p-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl uppercase font-bold hover:shadow-lg disabled:opacity-80 transition-all mt-auto">
            {loading ? 'Submitting...' : 'Post Listing'}
          </button>
          {error && <p className="text-rose-600 text-sm font-medium">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
