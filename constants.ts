
import { Property, UserRole, Booking } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Marine Drive Sky Villa',
    location: 'Worli, Mumbai',
    price: 450000,
    offer: false,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3200,
    description: 'A palatial sky villa overlooking the Arabian Sea. Features 12-foot ceilings, Italian marble flooring, and a private infinity pool facing the horizon.',
    amenities: ['Sea View', 'Private Elevator', 'Gym', 'Automated Home', 'Concierge'],
    type: 'Penthouse',
    purpose: 'sale'
  },
  {
    id: '2',
    title: 'Heritage Portuguese Estate',
    location: 'Assagao, Goa',
    price: 125000,
    offer: true,
    discountedPrice: 95000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 5,
    bathrooms: 5,
    sqft: 4500,
    description: 'A restored 19th-century Portuguese villa with modern amenities. Includes a lush tropical garden, high vaulted ceilings, and a private swimming pool.',
    amenities: ['Garden', 'Private Pool', 'Servant Quarters', 'Modular Kitchen'],
    type: 'Villa',
    purpose: 'rent'
  },
  {
    id: '3',
    title: 'Silicon Valley Smart Loft',
    location: 'Indiranagar, Bangalore',
    price: 85000,
    offer: false,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    description: 'Modern, tech-integrated loft in the heart of Bangalore. Features floor-to-ceiling glass walls, automated lighting, and proximity to major tech hubs.',
    amenities: ['EV Charging', 'Gym', 'High-Speed WiFi', 'Power Backup'],
    type: 'Apartment',
    purpose: 'rent'
  },
  {
    id: '4',
    title: 'The Royal Haveli Suite',
    location: 'Civil Lines, Jaipur',
    price: 550000,
    offer: true,
    discountedPrice: 480000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 6,
    bathrooms: 7,
    sqft: 6500,
    description: 'Experience royalty in this Rajasthani Haveli. Intricate stone carvings, courtyards with fountains, and hand-painted frescoes throughout the property.',
    amenities: ['Courtyard', 'Fountain', 'Traditional Decor', 'Security'],
    type: 'Villa',
    purpose: 'sale'
  },
  {
    id: '5',
    title: 'Backwater Tranquil Retreat',
    location: 'Alleppey, Kerala',
    price: 110000,
    offer: false,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2200,
    description: 'An eco-friendly home designed with traditional Kerala architecture. Overlooks the serene backwaters with a private boat docking area.',
    amenities: ['Waterfront', 'Private Dock', 'Ayurvedic Spa Room'],
    type: 'House',
    purpose: 'rent'
  },
  {
    id: '6',
    title: 'Modernist Delhi Mansion',
    location: 'Prithviraj Road, Delhi',
    price: 750000,
    offer: true,
    discountedPrice: 690000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 5800,
    description: 'A minimalist architectural marvel in Lutyens Delhi. Features expansive lawns, smart glass facades, and a temperature-controlled lap pool.',
    amenities: ['Vast Lawn', 'Lap Pool', 'Smart Home', 'Library'],
    type: 'House',
    purpose: 'sale'
  },
  {
    id: '7',
    title: 'Hitech City Corporate Flat',
    location: 'Madhapur, Hyderabad',
    price: 65000,
    offer: false,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1800,
    description: 'Spacious and breezy flat located right next to Hyderabad\'s tech corridor. Perfect for professionals looking for comfort and convenience.',
    amenities: ['Power Backup', '24/7 Security', 'Kids Play Area', 'Covered Parking'],
    type: 'Apartment',
    purpose: 'rent'
  }
];

export const MOCK_USER = {
  id: 'u1',
  name: 'Sathwik Pamu',
  email: 'sathwikpamu@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
  role: UserRole.ADMIN
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk_12345678',
    propertyId: '1',
    userId: 'u2',
    date: new Date().toISOString(),
    status: 'confirmed',
    totalPrice: 450000
  }
];
