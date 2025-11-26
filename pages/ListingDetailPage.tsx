import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Move, ArrowLeft } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const listing = useQuery(api.listings.getListing, { id });
  const agency = useQuery(api.agencies.getAgency, listing ? { id: listing.agencyId } : 'skip');

  if (listing === undefined || agency === undefined) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!listing) {
    return <div className="min-h-screen flex items-center justify-center">Listing Not Found</div>;
  }

  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-6">
        <Link to="/browse" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-96 rounded-xl overflow-hidden">
          <img src={listing.imageUrl} className="w-full h-full object-cover" alt="Main" />
          <div className="hidden sm:grid grid-cols-2 gap-2">
             <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">More photos coming soon</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <div className="border-b border-gray-200 pb-6">
             <div className="flex justify-between items-start">
               <div>
                  <h1 className="text-3xl font-extrabold text-gray-900">{listing.title}</h1>
               </div>
               <p className="text-3xl font-bold text-primary-600">${listing.price.toLocaleString()}</p>
             </div>
             
          </div>

          <div className="py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

        </div>

        {/* Sidebar / Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
             {agency && (
               <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                     <img src={agency.logoUrl || "https://ui-avatars.com/api/?name=Agency"} alt={agency.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                     <p className="text-sm text-gray-500">Listed by</p>
                     <p className="font-bold text-gray-900">{agency.name}</p>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
