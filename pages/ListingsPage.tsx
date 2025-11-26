import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Bed, Bath, Move } from 'lucide-react';
import { Listing } from '../types';
import { mockApi } from '../lib/mockApi';

export const ListingsPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await mockApi.getListings();
      setListings(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
         <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Find your next home</h1>
            <div className="mt-4 max-w-3xl relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                placeholder="Search by city, address, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
           <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-2 border-primary-600 rounded-full border-t-transparent"></div></div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <Link to={`/listing/${listing.id}`} key={listing.id} className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
                <div className="relative h-64">
                   <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                   <div className="absolute top-0 right-0 m-4 bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {listing.propertyType}
                   </div>
                </div>
                <div className="p-6">
                   <div className="flex justify-between items-start">
                     <div>
                        <p className="text-primary-600 font-bold text-xl">${listing.price.toLocaleString()}</p>
                        <h3 className="mt-1 text-lg font-medium text-gray-900 line-clamp-1">{listing.title}</h3>
                     </div>
                   </div>
                   <div className="mt-2 flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.city}, {listing.state}
                   </div>
                   
                   <div className="mt-6 border-t border-gray-100 pt-4 flex justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                         <Bed className="h-4 w-4 mr-1" /> {listing.beds} Beds
                      </div>
                      <div className="flex items-center">
                         <Bath className="h-4 w-4 mr-1" /> {listing.baths} Baths
                      </div>
                      <div className="flex items-center">
                         <Move className="h-4 w-4 mr-1" /> {listing.sqft} sqft
                      </div>
                   </div>
                </div>
              </Link>
            ))}
            
            {filteredListings.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                   No listings found matching your search.
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};