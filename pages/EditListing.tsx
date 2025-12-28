
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateListing, fetchPropertyById } from '../services/dataService';
import { Property } from '../types';

const EditListing: React.FC = () => {
  const { user } = useAuth();
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
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

  useEffect(() => {
    const loadListing = async () => {
        if (!listingId) return;
        const data = await fetchPropertyById(listingId);
        if (!data) {
            alert('Listing not found');
            navigate('/profile');
            return;
        }
        // Check ownership
        if (user && data.userId && data.userId !== user.id) {
            alert('You are not authorized to edit this listing');
            navigate('/profile');
            return;
        }

        setFormData({
            title: data.title,
            description: data.description,
            address: data.location,
            regularPrice: data.price,
            discountPrice: data.discountedPrice || 0,
            bathrooms: data.bathrooms,
            bedrooms: data.bedrooms,
            furnished: data.amenities.includes('Furnished'),
            parking: data.amenities.includes('Parking'),
            type: data.purpose,
            offer: data.offer,
            image: data.image
        });
        setPreviewImage(data.image);
        setFetching(false);
    };
    loadListing();
  }, [listingId, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.checked });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      setPreviewImage(url);
      setFormData({ ...formData, image: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !listingId) return;
    
    setLoading(true);
    setError(null);
    
    const updates: Partial<Property> = {
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
        image: previewImage || formData.image,
    };

    const res = await updateListing(listingId, updates);
    
    setLoading(false);
    if (res.success) {
        navigate('/profile');
    } else {
        setError(res.error || 'Failed to update listing');
    }
  };

  if (fetching) return <div className="min-h-screen pt-32 text-center">Loading listing details...</div>;

  return (
    <div className="p-3 max-w-4xl mx-auto pt-28 pb-20">
      <h1 className="text-3xl font-bold text-center my-7 text-slate-800">Edit Listing</h1>
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
          <p className="font-semibold text-slate-700">Images:</p>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400">Image URL:</p>
            <input 
                type="text" 
                placeholder="https://..." 
                className="border border-slate-200 p-2 rounded-xl text-sm"
                onChange={handleImageUrlChange}
                value={formData.image}
            />
          </div>
          
          {/* Image Preview */}
          {previewImage && (
              <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
          )}

          <button disabled={loading} className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl uppercase font-semibold hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-80 transition-all mt-auto">
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
          {error && <p className="text-rose-600 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default EditListing;
