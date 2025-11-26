import { Agency, Lead, Listing, User, UserRole } from '../types';

// --- Mock Data Store ---

const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Sarah Jenkins',
    email: 'sarah@prestige.com',
    role: UserRole.PROVIDER_ADMIN,
    agencyId: 'agency_1',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'user_2',
    name: 'John Doe',
    email: 'john@gmail.com',
    role: UserRole.CONSUMER,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
];

const MOCK_AGENCIES: Agency[] = [
  {
    id: 'agency_1',
    ownerId: 'user_1',
    name: 'Prestige Worldwide Realty',
    subdomain: 'prestige',
    logoUrl: 'https://ui-avatars.com/api/?name=Prestige+Realty&background=0D8ABC&color=fff&size=128',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
    description: 'We specialize in high-end luxury properties across the metropolitan area. With over 20 years of experience, we bring dreams to life.',
    contactEmail: 'contact@prestige.com',
    contactPhone: '(555) 123-4567',
    address: '123 Skyline Blvd, Metropolis, NY',
  },
  {
    id: 'agency_2',
    ownerId: 'user_99',
    name: 'Urban Living Group',
    subdomain: 'urban',
    logoUrl: 'https://ui-avatars.com/api/?name=Urban+Living&background=10B981&color=fff&size=128',
    coverUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=2070',
    description: 'Modern lofts, city condos, and the pulse of the downtown market.',
    contactEmail: 'hello@urbanliving.com',
    contactPhone: '(555) 987-6543',
    address: '456 Downtown Ave, Metropolis, NY',
  }
];

const MOCK_LISTINGS: Listing[] = [
  {
    id: 'list_1',
    agencyId: 'agency_1',
    title: 'Modern Luxury Villa with Ocean View',
    description: 'Experience the pinnacle of luxury living in this architectural masterpiece. Featuring panoramic ocean views, an infinity pool, and a state-of-the-art smart home system.',
    price: 4500000,
    address: '101 Ocean Drive',
    city: 'Malibu',
    state: 'CA',
    beds: 5,
    baths: 6,
    sqft: 6500,
    propertyType: 'Residential',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1600596542815-2250c385528c?auto=format&fit=crop&q=80&w=1600'
    ],
    features: ['Pool', 'Ocean View', 'Smart Home', 'Wine Cellar', 'Gated Community']
  },
  {
    id: 'list_2',
    agencyId: 'agency_1',
    title: 'Downtown Penthouse Loft',
    description: 'Stunning industrial-chic loft in the heart of the city. High ceilings, exposed brick, and floor-to-ceiling windows offering skyline views.',
    price: 1250000,
    address: '45 Main St, Apt 402',
    city: 'New York',
    state: 'NY',
    beds: 2,
    baths: 2,
    sqft: 1800,
    propertyType: 'Residential',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1600'
    ],
    features: ['City View', 'Concierge', 'Gym', 'Parking']
  },
  {
    id: 'list_3',
    agencyId: 'agency_2',
    title: 'Cozy Family Home in Suburbs',
    description: 'Perfect starter home with a large backyard and newly renovated kitchen. Close to top-rated schools and parks.',
    price: 650000,
    address: '789 Maple Lane',
    city: 'Austin',
    state: 'TX',
    beds: 3,
    baths: 2,
    sqft: 2200,
    propertyType: 'Residential',
    status: 'Pending',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1600'
    ],
    features: ['Large Yard', 'Renovated Kitchen', 'Fireplace']
  },
  {
    id: 'list_4',
    agencyId: 'agency_2',
    title: 'Commercial Office Space',
    description: 'Prime location for your business. Open floor plan, ready for customization. High foot traffic area.',
    price: 3500,
    address: '500 Business Pkwy',
    city: 'Chicago',
    state: 'IL',
    beds: 0,
    baths: 2,
    sqft: 3000,
    propertyType: 'Rental',
    status: 'Active',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600'
    ],
    features: ['High Speed Internet', 'Security', 'Parking']
  }
];

const MOCK_LEADS: Lead[] = [
  {
    id: 'lead_1',
    listingId: 'list_1',
    agencyId: 'agency_1',
    consumerName: 'Michael Scott',
    consumerEmail: 'michael@dunder.com',
    consumerPhone: '555-000-1111',
    message: 'I am interested in this property. Is there a discount for regional managers?',
    status: 'New',
    createdAt: new Date().toISOString()
  },
  {
    id: 'lead_2',
    listingId: 'list_2',
    agencyId: 'agency_1',
    consumerName: 'Pam Beesly',
    consumerEmail: 'pam@artschool.edu',
    consumerPhone: '555-222-3333',
    message: 'Can we schedule a viewing for this weekend?',
    status: 'Contacted',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// --- API Helpers ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Session State (simulated)
let currentUser: User | null = null;

export const mockApi = {
  // Auth
  login: async (email: string): Promise<User> => {
    await delay(800);
    const existing = MOCK_USERS.find(u => u.email === email);
    if (existing) {
      currentUser = existing;
      return existing;
    }
    // Create new user if not found (Sign up flow)
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: null, // Triggers role selection
      avatarUrl: `https://ui-avatars.com/api/?name=${email}&background=random`
    };
    MOCK_USERS.push(newUser);
    currentUser = newUser;
    return newUser;
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(300);
    return currentUser;
  },

  logout: async () => {
    await delay(300);
    currentUser = null;
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<User> => {
    await delay(500);
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    user.role = role;
    
    // If provider, auto-create a stub agency if one doesn't exist
    if (role === UserRole.PROVIDER_ADMIN && !user.agencyId) {
      const newAgency: Agency = {
        id: `agency_${Date.now()}`,
        ownerId: userId,
        name: `${user.name}'s Agency`,
        subdomain: `agency-${Date.now()}`,
        logoUrl: '',
        coverUrl: '',
        description: 'Welcome to our agency.',
        contactEmail: user.email,
        contactPhone: '',
        address: ''
      };
      MOCK_AGENCIES.push(newAgency);
      user.agencyId = newAgency.id;
    }
    
    return user;
  },

  // Listings
  getListings: async (filters?: { query?: string, city?: string }): Promise<Listing[]> => {
    await delay(600);
    let results = [...MOCK_LISTINGS];
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(l => l.title.toLowerCase().includes(q) || l.city.toLowerCase().includes(q));
    }
    return results;
  },

  getListingById: async (id: string): Promise<Listing | undefined> => {
    await delay(400);
    return MOCK_LISTINGS.find(l => l.id === id);
  },

  createListing: async (listingData: Omit<Listing, 'id' | 'status'>): Promise<Listing> => {
    await delay(1000);
    const newListing: Listing = {
      ...listingData,
      id: `list_${Date.now()}`,
      status: 'Active'
    };
    MOCK_LISTINGS.unshift(newListing); // Add to top
    return newListing;
  },

  deleteListing: async (id: string): Promise<void> => {
    await delay(500);
    const idx = MOCK_LISTINGS.findIndex(l => l.id === id);
    if (idx > -1) MOCK_LISTINGS.splice(idx, 1);
  },

  // Agencies
  getAgencyById: async (id: string): Promise<Agency | undefined> => {
    await delay(400);
    return MOCK_AGENCIES.find(a => a.id === id);
  },

  getAgencyByOwner: async (ownerId: string): Promise<Agency | undefined> => {
    await delay(400);
    return MOCK_AGENCIES.find(a => a.ownerId === ownerId);
  },

  // Leads
  submitLead: async (leadData: Omit<Lead, 'id' | 'status' | 'createdAt'>): Promise<Lead> => {
    await delay(800);
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    MOCK_LEADS.push(newLead);
    return newLead;
  },

  getLeadsForAgency: async (agencyId: string): Promise<Lead[]> => {
    await delay(600);
    return MOCK_LEADS.filter(l => l.agencyId === agencyId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};
