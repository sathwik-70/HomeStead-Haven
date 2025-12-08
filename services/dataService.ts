
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Property, Booking, Review } from '../types';
import { MOCK_PROPERTIES, MOCK_BOOKINGS } from '../constants';

// --- Local Storage Helpers for Offline Functionality ---
const getLocalProperties = (): Property[] => {
  const stored = localStorage.getItem('haven_properties');
  if (!stored) {
    localStorage.setItem('haven_properties', JSON.stringify(MOCK_PROPERTIES));
    return MOCK_PROPERTIES;
  }
  return JSON.parse(stored);
};

const getLocalBookings = (): Booking[] => {
  const stored = localStorage.getItem('haven_bookings');
  return stored ? JSON.parse(stored) : MOCK_BOOKINGS;
};

const getLocalReviews = (): Review[] => {
  const stored = localStorage.getItem('haven_reviews');
  return stored ? JSON.parse(stored) : [];
};

const saveLocalProperties = (properties: Property[]) => {
  localStorage.setItem('haven_properties', JSON.stringify(properties));
};

const saveLocalBookings = (bookings: Booking[]) => {
  localStorage.setItem('haven_bookings', JSON.stringify(bookings));
};

const saveLocalReviews = (reviews: Review[]) => {
  localStorage.setItem('haven_reviews', JSON.stringify(reviews));
};

// --- Storage Methods ---

export const uploadPropertyImage = async (file: File): Promise<string | null> => {
  if (!isSupabaseConfigured) {
    // Fallback for demo/offline: create a local object URL
    return URL.createObjectURL(file);
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// --- API Methods ---

export const fetchProperties = async (): Promise<Property[]> => {
  if (!isSupabaseConfigured) return getLocalProperties();

  try {
    const { data, error } = await supabase.from('properties').select('*');
    if (error || !data) throw error;
    
    return data.map((p: any) => ({
        ...p,
        discountedPrice: p.discounted_price,
        userId: p.user_id,
        amenities: p.amenities || [],
        imageUrls: p.image_urls || [p.image]
    })) as Property[];
  } catch (error) {
    console.warn('Supabase fetch failed, using local:', error);
    return getLocalProperties();
  }
};

export const fetchPropertyById = async (id: string): Promise<Property | undefined> => {
  if (!isSupabaseConfigured) {
    const props = getLocalProperties();
    return props.find(p => p.id === id);
  }

  try {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
    if (error) throw error;
    return {
        ...data,
        discountedPrice: data.discounted_price,
        userId: data.user_id,
        amenities: data.amenities || [],
        imageUrls: data.image_urls || [data.image]
    } as Property;
  } catch (error) {
    return getLocalProperties().find(p => p.id === id);
  }
};

export const fetchBookings = async (): Promise<Booking[]> => {
  if (!isSupabaseConfigured) return getLocalBookings();

  try {
    const { data, error } = await supabase.from('bookings').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data.map((b: any) => ({
      id: b.id,
      propertyId: b.property_id,
      userId: b.user_id,
      date: b.date,
      startDate: b.start_date,
      endDate: b.end_date,
      status: b.status,
      totalPrice: b.total_price
    })) as Booking[];
  } catch (error) {
    return getLocalBookings();
  }
};

export const fetchUserBookings = async (userId: string): Promise<Booking[]> => {
  if (!isSupabaseConfigured) {
    return getLocalBookings().filter(b => b.userId === userId);
  }
  try {
    const { data, error } = await supabase.from('bookings').select('*').eq('user_id', userId);
    if (error) throw error;
    return data.map((b: any) => ({
      id: b.id,
      propertyId: b.property_id,
      userId: b.user_id,
      date: b.date,
      startDate: b.start_date,
      endDate: b.end_date,
      status: b.status,
      totalPrice: b.total_price
    })) as Booking[];
  } catch {
    return getLocalBookings().filter(b => b.userId === userId);
  }
};

export const fetchUserListings = async (userId: string): Promise<Property[]> => {
  if (!isSupabaseConfigured) {
    const props = getLocalProperties();
    return props.filter(p => p.userId === userId || (!p.userId && Number(p.id) > 100)); 
  }

  try {
    const { data, error } = await supabase.from('properties').select('*').eq('user_id', userId);
    if (error) throw error;
    return data.map((p: any) => ({
        ...p,
        discountedPrice: p.discounted_price,
        userId: p.user_id,
        amenities: p.amenities || [],
        imageUrls: p.image_urls || [p.image]
    })) as Property[];
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return [];
  }
};

// Check if dates overlap with existing confirmed bookings
export const checkAvailability = async (propertyId: string, startDate: string, endDate: string): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    const bookings = getLocalBookings().filter(b => b.propertyId === propertyId && b.status !== 'cancelled');
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return !bookings.some(b => {
      if (!b.startDate || !b.endDate) return false;
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      return (start < bEnd && end > bStart);
    });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('property_id', propertyId)
      .neq('status', 'cancelled')
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

    if (error) throw error;
    return data.length === 0;
  } catch (error) {
    console.error('Availability check error:', error);
    return true; // Fail safe
  }
};

export const createBooking = async (bookingData: Partial<Booking>): Promise<{ success: boolean; error?: string }> => {
  const newBooking: Booking = {
    id: Math.random().toString(36).substr(2, 9),
    propertyId: bookingData.propertyId!,
    userId: bookingData.userId!,
    date: new Date().toISOString(),
    startDate: bookingData.startDate,
    endDate: bookingData.endDate,
    status: 'pending',
    totalPrice: bookingData.totalPrice || 0
  };

  if (newBooking.startDate && newBooking.endDate) {
    const isAvailable = await checkAvailability(newBooking.propertyId, newBooking.startDate, newBooking.endDate);
    if (!isAvailable) {
      return { success: false, error: "Dates are already booked" };
    }
  }

  if (!isSupabaseConfigured) {
    const bookings = getLocalBookings();
    bookings.push(newBooking);
    saveLocalBookings(bookings);
    return { success: true };
  }

  try {
    const { error } = await supabase.from('bookings').insert([{
      property_id: newBooking.propertyId,
      user_id: newBooking.userId,
      total_price: newBooking.totalPrice,
      status: newBooking.status,
      date: newBooking.date,
      start_date: newBooking.startDate,
      end_date: newBooking.endDate
    }]);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const createListing = async (listingData: Partial<Property>): Promise<{ success: boolean; error?: string }> => {
  const newProperty = {
    ...listingData,
    id: Math.random().toString(36).substr(2, 9),
    rating: 0,
    sqft: listingData.sqft || Math.floor(Math.random() * 2000) + 500,
    imageUrls: listingData.imageUrls || [listingData.image!]
  } as Property;

  if (!isSupabaseConfigured) {
    const props = getLocalProperties();
    props.unshift(newProperty);
    saveLocalProperties(props);
    return { success: true };
  }

  try {
    const { error } = await supabase.from('properties').insert([{
      title: newProperty.title,
      description: newProperty.description,
      location: newProperty.location,
      price: newProperty.price,
      offer: newProperty.offer,
      discounted_price: newProperty.discountedPrice,
      bedrooms: newProperty.bedrooms,
      bathrooms: newProperty.bathrooms,
      type: newProperty.type,
      amenities: newProperty.amenities,
      image: newProperty.image,
      image_urls: newProperty.imageUrls, // Save array of images
      sqft: newProperty.sqft,
      purpose: newProperty.purpose,
      user_id: newProperty.userId
    }]);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Create listing error details:", error);
    return { success: false, error: error.message + " (Check console for details)" };
  }
};

export const updateListing = async (id: string, updates: Partial<Property>): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
        const props = getLocalProperties();
        const index = props.findIndex(p => p.id === id);
        if (index !== -1) {
            props[index] = { ...props[index], ...updates };
            saveLocalProperties(props);
            return { success: true };
        }
        return { success: false, error: "Listing not found locally" };
    }

    try {
        const payload: any = {
            title: updates.title,
            description: updates.description,
            location: updates.location,
            price: updates.price,
            offer: updates.offer,
            discounted_price: updates.discountedPrice,
            bedrooms: updates.bedrooms,
            bathrooms: updates.bathrooms,
            type: updates.type,
            amenities: updates.amenities,
            image: updates.image,
            purpose: updates.purpose
        };

        // Remove undefined keys
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { error } = await supabase.from('properties').update(payload).eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const deleteListing = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    const props = getLocalProperties().filter(p => p.id !== id);
    saveLocalProperties(props);
    return true;
  }
  try {
    await supabase.from('properties').delete().eq('id', id);
    return true;
  } catch {
    return false;
  }
};

// --- Review System ---

export const fetchReviews = async (propertyId: string): Promise<Review[]> => {
  if (!isSupabaseConfigured) {
    return getLocalReviews().filter(r => r.propertyId === propertyId);
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Map DB fields to Review type
    return data.map((r: any) => ({
         id: r.id,
         propertyId: r.property_id,
         userId: r.user_id,
         rating: r.rating,
         comment: r.comment,
         date: r.created_at,
         userName: r.user_name || 'Verified User', 
         userAvatar: r.user_avatar || `https://ui-avatars.com/api/?name=${r.user_name || 'User'}&background=random`
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const createReview = async (review: Partial<Review>): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured) {
    const reviews = getLocalReviews();
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: review.propertyId!,
      userId: review.userId!,
      rating: review.rating!,
      comment: review.comment!,
      date: new Date().toISOString(),
      userName: review.userName,
      userAvatar: review.userAvatar
    };
    reviews.unshift(newReview);
    saveLocalReviews(reviews);
    return { success: true };
  }

  try {
    const { error } = await supabase.from('reviews').insert([{
      property_id: review.propertyId,
      user_id: review.userId,
      rating: review.rating,
      comment: review.comment,
      user_name: review.userName, // Save user name to DB
      user_avatar: review.userAvatar // Save avatar to DB
    }]);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
