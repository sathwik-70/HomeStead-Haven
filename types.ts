
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  discountedPrice?: number;
  offer: boolean;
  rating: number;
  image: string;
  imageUrls?: string[]; // For slider
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  amenities: string[];
  type: 'House' | 'Apartment' | 'Villa' | 'Penthouse';
  purpose: 'rent' | 'sale';
  userId?: string;
  reviews?: Review[]; // Optional populated field
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  date: string; // Created at date
  startDate?: string; // Check-in
  endDate?: string; // Check-out
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName?: string; // For display
  userAvatar?: string; // For display
  rating: number;
  comment: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
