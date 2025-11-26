import React, { useEffect, useState } from 'react';
import { Plus, LayoutGrid, Users, Settings, MessageSquare, Trash2, Edit2, Eye, MapPin } from 'lucide-react';
import { Agency, Listing, User, Lead } from '../types';
import { mockApi } from '../lib/mockApi';

interface DashboardProps {
  user: User;
}

export const DashboardPage: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'leads' | 'settings'>('listings');
  const [agency, setAgency] = useState<Agency | undefined>(undefined);
  const [listings, setListings] = useState<Listing[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // New Listing Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListingTitle, setNewListingTitle] = useState('');
  const [newListingPrice, setNewListingPrice] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedAgency = await mockApi.getAgencyByOwner(user.id);
      setAgency(fetchedAgency);

      if (fetchedAgency) {
        // In a real app we'd filter by agencyId, here we rely on the mock helper filtering logic or just fetching all and filtering client side for simplicity if needed
        // For MVP mock, let's just fetch all and filter manually to be safe
        const allListings = await mockApi.getListings();
        setListings(allListings.filter(l => l.agencyId === fetchedAgency.id));
        
        const agencyLeads = await mockApi.getLeadsForAgency(fetchedAgency.id);
        setLeads(agencyLeads);
      }
      setLoading(false);
    };
    fetchData();
  }, [user.id]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency) return;

    // Simulate creation
    const listing = await mockApi.createListing({
      agencyId: agency.id,
      title: newListingTitle,
      description: 'Newly listed property.',
      price: Number(newListingPrice),
      address: '123 New Street',
      city: 'Metropolis',
      state: 'NY',
      beds: 3,
      baths: 2,
      sqft: 2000,
      propertyType: 'Residential',
      images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1600'],
      features: ['New']
    });

    setListings([listing, ...listings]);
    setShowCreateModal(false);
    setNewListingTitle('');
    setNewListingPrice('');
  };

  const handleDelete = async (id: string) => {
      await mockApi.deleteListing(id);
      setListings(listings.filter(l => l.id !== id));
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  if (!agency) return <div className="p-8 text-center">Agency profile not found. Please contact support.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{agency.name}</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your storefront, listings, and leads.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
             <button onClick={() => window.open(`/#/agency/${agency.id}`, '_blank')} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <Eye className="h-4 w-4 mr-2" /> View Storefront
             </button>
             <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none">
                <Plus className="h-4 w-4 mr-2" /> Add Listing
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('listings')}
              className={`${activeTab === 'listings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <LayoutGrid className="mr-2 h-5 w-5" /> Listings ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`${activeTab === 'leads' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <MessageSquare className="mr-2 h-5 w-5" /> Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${activeTab === 'settings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Settings className="mr-2 h-5 w-5" /> Settings
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
                <div className="relative h-48">
                  <img className="h-full w-full object-cover" src={listing.images[0]} alt={listing.title} />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm uppercase tracking-wide">
                    {listing.status}
                  </div>
                </div>
                <div className="px-4 py-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{listing.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{listing.address}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">${listing.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between">
                   <button className="text-gray-500 hover:text-primary-600 font-medium text-sm flex items-center">
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                   </button>
                   <button onClick={() => handleDelete(listing.id)} className="text-red-400 hover:text-red-600 font-medium text-sm flex items-center">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leads' && (
           <div className="bg-white shadow overflow-hidden sm:rounded-md">
             <ul className="divide-y divide-gray-200">
               {leads.map((lead) => (
                 <li key={lead.id} className="px-6 py-4">
                   <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{lead.consumerName}</h4>
                        <div className="text-sm text-gray-500 mt-1">re: Listing #{lead.listingId.split('_')[1]}</div>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.status === 'New' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {lead.status}
                      </span>
                   </div>
                   <p className="mt-2 text-gray-600 text-sm">{lead.message}</p>
                   <div className="mt-3 text-xs text-gray-400 flex items-center gap-4">
                      <span>{lead.consumerEmail}</span>
                      <span>{lead.consumerPhone}</span>
                      <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                   </div>
                 </li>
               ))}
               {leads.length === 0 && <li className="p-8 text-center text-gray-500">No leads yet.</li>}
             </ul>
           </div>
        )}

        {activeTab === 'settings' && (
           <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Storefront Settings</h3>
              <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700">Agency Name</label>
                   <input type="text" disabled value={agency.name} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Subdomain</label>
                   <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        https://
                      </span>
                      <input type="text" disabled value={`${agency.subdomain}.agentflow.pro`} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm" />
                   </div>
                </div>
                <div className="pt-4">
                   <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Save Changes</button>
                </div>
              </div>
           </div>
        )}

      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Add New Listing</h3>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input required type="text" value={newListingTitle} onChange={e => setNewListingTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input required type="number" value={newListingPrice} onChange={e => setNewListingPrice(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};