
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
        
        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreviewImage(localUrl);

        // Upload to Storage
        setUploading(true);
        const publicUrl = await uploadPropertyImage(file);
        setUploading(false);

        if (publicUrl) {
            setFormData({ ...formData, image: publicUrl });
        } else {
            setError("Failed to upload image. Please try a valid URL instead.");
        }
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      setPreviewImage(url);
      setFormData({ ...formData, image: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
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
        image: formData.image || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1000&auto=format&fit=crop',
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
      <h1 className="text-3xl font-bold text-center my-7 text-slate-800">Create a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Title"
            className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            id="title"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            placeholder="Description"
            className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all h-32"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
              <span className="text-slate-700">Sell</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="rent" className="w-5 h-5 accent-emerald-500" 
                checked={formData.type === 'rent'} 
                onChange={() => setFormData({...formData, type: 'rent'})} 
              />
              <span className="text-slate-700">Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="parking" className="w-5 h-5 accent-emerald-500" 
                onChange={handleCheckboxChange} 
                checked={formData.parking}
              />
              <span className="text-slate-700">Parking spot</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="furnished" className="w-5 h-5 accent-emerald-500" 
                onChange={handleCheckboxChange} 
                checked={formData.furnished}
              />
              <span className="text-slate-700">Furnished</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="offer" className="w-5 h-5 accent-emerald-500" 
                onChange={handleCheckboxChange} 
                checked={formData.offer}
              />
              <span className="text-slate-700">Offer</span>
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
                className="p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none w-20"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p className="text-slate-600">Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none w-20"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p className="text-slate-600">Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none w-32"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p className="text-slate-600">Regular price</p>
                <span className="text-xs text-slate-400">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none w-32"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p className="text-slate-600">Discounted price</p>
                  <span className="text-xs text-slate-400">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-slate-700">Images:
            <span className="font-normal text-slate-400 ml-2">Upload or paste URL (max 6)</span>
          </p>
          
          {/* File Upload Area */}
          <div className="flex gap-4">
            <input 
                onChange={handleImageChange}
                className="hidden" 
                type="file" 
                id="images" 
                accept="image/*" 
            />
            <label htmlFor="images" className={`p-4 border-2 border-dashed border-slate-300 rounded-xl w-full text-slate-500 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 cursor-pointer text-center flex flex-col items-center gap-2 transition-all ${uploading ? 'bg-slate-100 opacity-50 cursor-not-allowed' : ''}`}>
                <UploadCloud size={24} />
                {uploading ? 'Uploading...' : 'Click to Upload Image'}
            </label>
          </div>

          <div className="flex items-center gap-2">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs text-slate-400 uppercase">OR</span>
              <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400">Paste Image URL:</p>
            <input 
                type="text" 
                placeholder="https://..." 
                className="border border-slate-200 p-2 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                onChange={handleImageUrlChange}
                value={formData.image}
            />
          </div>
          
          {/* Image Preview */}
          {previewImage && (
              <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => { setPreviewImage(null); setFormData({ ...formData, image: '' }); }} 
                    className="absolute top-2 right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                      Remove
                  </button>
              </div>
          )}

          <button disabled={loading || uploading} className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl uppercase font-semibold hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-80 transition-all mt-auto">
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className="text-rose-600 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
