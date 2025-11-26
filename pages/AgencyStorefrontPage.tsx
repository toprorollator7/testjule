import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Agency, Listing } from '../types';
import { mockApi } from '../lib/mockApi';

export const AgencyStorefrontPage = () => {
  const { agencyId } = useParams<{ agencyId: string }>();
  const [agency, setAgency] = useState<Agency | undefined>(undefined);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!agencyId) return;
      setLoading(true);
      const a = await mockApi.getAgencyById(agencyId);
      setAgency(a);
      if (a) {
        // filter client side for mock
        const all = await mockApi.getListings();
        setListings(all.filter(l => l.agencyId === a.id));
      }
      setLoading(false);
    };
    fetch();
  }, [agencyId]);

  if (loading) return <div></div>;
  if (!agency) return <div className="p-8 text-center text-xl">Agency not found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Agency Header / Cover */}
      <div className="relative h-64 md:h-80 w-full">
         <img src={agency.coverUrl} className="w-full h-full object-cover" alt="Cover" />
         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
               <h1 className="text-4xl md:text-5xl font-bold">{agency.name}</h1>
               <p className="mt-2 text-xl opacity-90">{agency.description}</p>
            </div>
         </div>
      </div>
      
      {/* Contact Info Bar */}
      <div className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center md:justify-around items-center space-y-2 md:space-y-0 text-sm md:text-base">
           <div className="flex items-center"><MapPin className="h-5 w-5 mr-2 text-primary-400" /> {agency.address}</div>
           <div className="flex items-center"><Phone className="h-5 w-5 mr-2 text-primary-400" /> {agency.contactPhone}</div>
           <div className="flex items-center"><Mail className="h-5 w-5 mr-2 text-primary-400" /> {agency.contactEmail}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Our Exclusive Listings</h2>
         
         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link to={`/listing/${listing.id}`} key={listing.id} className="group block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                <div className="relative h-60 overflow-hidden rounded-t-lg">
                   <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-6">
                   <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
                   <p className="text-gray-500 mb-4">{listing.city}, {listing.state}</p>
                   <div className="flex justify-between items-center">
                      <span className="text-primary-600 font-bold text-lg">${listing.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-400">{listing.propertyType}</span>
                   </div>
                </div>
              </Link>
            ))}
            {listings.length === 0 && <p className="text-gray-500">No active listings at the moment.</p>}
         </div>
      </div>
    </div>
  );
};