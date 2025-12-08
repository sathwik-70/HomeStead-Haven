import { Property, UserRole, Booking } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Azure Skyline Penthouse',
    location: 'Miami, FL',
    price: 4500,
    offer: false,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2800,
    description: 'Experience luxury living at its finest in this glass-walled penthouse overlooking the ocean. Features a private infinity pool and smart home integration.',
    amenities: ['Pool', 'WiFi', 'Gym', 'Smart Home', 'Concierge'],
    type: 'Penthouse',
    purpose: 'sale'
  },
  {
    id: '2',
    title: 'Nordic Forest Cabin',
    location: 'Aspen, CO',
    price: 1200,
    offer: true,
    discountedPrice: 950,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 4,
    bathrooms: 2,
    sqft: 1800,
    description: 'A cozy, modern cabin nestled in the pines. Perfect for winter getaways with a floor-to-ceiling stone fireplace and heated floors.',
    amenities: ['Fireplace', 'Hot Tub', 'Hiking Trails', 'Kitchen'],
    type: 'House',
    purpose: 'rent'
  },
  {
    id: '3',
    title: 'Urban Glass Loft',
    location: 'New York, NY',
    price: 3200,
    offer: false,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 1,
    bathrooms: 1.5,
    sqft: 1200,
    description: 'Industrial chic meets modern luxury in this SoHo loft. High ceilings, exposed brick, and massive windows make this a photographer dream.',
    amenities: ['Elevator', 'Gym', 'Workplace', 'WiFi'],
    type: 'Apartment',
    purpose: 'rent'
  },
  {
    id: '4',
    title: 'Mediterranean Villa',
    location: 'Santorini, Greece',
    price: 5500,
    offer: true,
    discountedPrice: 4800,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 4500,
    description: 'Classic whitewashed villa with blue domes, offering unobstructed sunset views over the caldera. Includes private chef options.',
    amenities: ['Pool', 'Chef', 'Ocean View', 'Terrace'],
    type: 'Villa',
    purpose: 'sale'
  },
  {
    id: '5',
    title: 'Eco-Modern Desert Oasis',
    location: 'Joshua Tree, CA',
    price: 1800,
    offer: false,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1500,
    description: 'Sustainable luxury off-the-grid. Solar powered with mirror glass exterior that reflects the desert landscape.',
    amenities: ['Solar Power', 'Stargazing', 'Fire Pit'],
    type: 'House',
    purpose: 'rent'
  },
  {
    id: '6',
    title: 'Kyoto Zen Garden Home',
    location: 'Kyoto, Japan',
    price: 2200,
    offer: true,
    discountedPrice: 1900,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1900,
    description: 'Traditional aesthetics with modern comforts. Features a private tea room and a meticulously maintained zen garden.',
    amenities: ['Garden', 'Tea Room', 'WiFi', 'Bath'],
    type: 'House',
    purpose: 'sale'
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
    totalPrice: 13500
  },
  {
    id: 'bk_87654321',
    propertyId: '3',
    userId: 'u3',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'pending',
    totalPrice: 3200
  },
  {
    id: 'bk_11223344',
    propertyId: '4',
    userId: 'u4',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'cancelled',
    totalPrice: 5500
  }
];