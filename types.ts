export enum UserRole {
  PROVIDER_ADMIN = 'provider_admin',
  TEAM_MEMBER = 'team_member',
  CONSUMER = 'consumer',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | null; // Null if not selected yet
  agencyId?: string; // If they belong to an agency
  avatarUrl?: string;
}

export interface Agency {
  id: string;
  ownerId: string;
  name: string;
  subdomain: string; // modeled as unique string
  logoUrl: string;
  coverUrl: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface Listing {
  id: string;
  agencyId: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: 'Residential' | 'Commercial' | 'Rental' | 'Land';
  status: 'Active' | 'Pending' | 'Sold';
  images: string[];
  features: string[];
}

export interface Lead {
  id: string;
  listingId: string;
  agencyId: string;
  consumerName: string;
  consumerEmail: string;
  consumerPhone: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}
