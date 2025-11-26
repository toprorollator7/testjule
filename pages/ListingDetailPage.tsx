import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Bed, Bath, Move, User as UserIcon, Check } from 'lucide-react';
import { Listing, Agency } from '../types';
import { mockApi } from '../lib/mockApi';

export const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | undefined>(undefined);
  const [agency, setAgency] = useState<Agency | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMsg, setFormMsg] = useState('I am interested in this property. Please contact me.');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      const l = await mockApi.getListingById(id);
      setListing(l);
      if (l) {
        const a = await mockApi.getAgencyById(l.agencyId);
        setAgency(a);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setFormStatus('submitting');
    
    await mockApi.submitLead({
       listingId: listing.id,
       agencyId: listing.agencyId,
       consumerName: formName,
       consumerEmail: formEmail,
       consumerPhone: formPhone,
       message: formMsg
    });

    setFormStatus('success');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!listing) return <div className="min-h-screen flex items-center justify-center">Listing Not Found</div>;

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Hero Image Grid */}
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-96 rounded-xl overflow-hidden">
          <img src={listing.images[0]} className="w-full h-full object-cover" alt="Main" />
          <div className="hidden sm:grid grid-cols-2 gap-2">
            {listing.images.slice(1, 5).map((img, idx) => (
               <img key={idx} src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
            ))}
             {/* If only 1 image, fill with placeholder for grid or just hide (simplified logic here) */}
             {listing.images.length < 2 && <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">More photos coming soon</div>}
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
                  <div className="mt-2 flex items-center text-gray-500">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" /> {listing.address}, {listing.city}, {listing.state}
                  </div>
               </div>
               <p className="text-3xl font-bold text-primary-600">${listing.price.toLocaleString()}</p>
             </div>
             
             <div className="mt-8 flex space-x-8 text-gray-900">
               <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg min-w-[100px]">
                 <Bed className="h-6 w-6 mb-2 text-gray-400" />
                 <span className="font-bold text-xl">{listing.beds}</span>
                 <span className="text-xs text-gray-500 uppercase">Beds</span>
               </div>
               <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg min-w-[100px]">
                 <Bath className="h-6 w-6 mb-2 text-gray-400" />
                 <span className="font-bold text-xl">{listing.baths}</span>
                 <span className="text-xs text-gray-500 uppercase">Baths</span>
               </div>
               <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg min-w-[100px]">
                 <Move className="h-6 w-6 mb-2 text-gray-400" />
                 <span className="font-bold text-xl">{listing.sqft}</span>
                 <span className="text-xs text-gray-500 uppercase">Sq Ft</span>
               </div>
             </div>
          </div>

          <div className="py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          <div className="py-8 border-t border-gray-200">
             <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {listing.features.map(f => (
                 <div key={f} className="flex items-center text-gray-600">
                   <Check className="h-4 w-4 mr-2 text-green-500" /> {f}
                 </div>
               ))}
             </div>
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

             <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Agent</h3>
             
             {formStatus === 'success' ? (
               <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-2">
                   <Check className="h-6 w-6 text-green-600" />
                 </div>
                 <h4 className="text-lg font-medium text-green-900">Inquiry Sent!</h4>
                 <p className="text-sm text-green-700 mt-1">The agency will contact you shortly.</p>
                 <button onClick={() => setFormStatus('idle')} className="mt-4 text-sm text-green-700 underline">Send another</button>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Name</label>
                   <input required type="text" value={formName} onChange={e => setFormName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Email</label>
                   <input required type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Phone</label>
                   <input required type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Message</label>
                   <textarea required rows={4} value={formMsg} onChange={e => setFormMsg(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
                 </div>
                 <button disabled={formStatus === 'submitting'} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
                   {formStatus === 'submitting' ? 'Sending...' : 'Request Info'}
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};