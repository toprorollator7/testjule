import React, { useState } from 'react';
import { Plus, LayoutGrid, Trash2, Edit2, Eye } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useStorage } from '../hooks/useStorage';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'listings'>('listings');
  const agency = useQuery(api.agencies.get);
  const listings = useQuery(api.listings.getListings);
  const createListing = useMutation(api.listings.create);
  const deleteListing = useMutation(api.listings.deleteListing);
  const { uploadFile } = useStorage();

  // New Listing Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListingTitle, setNewListingTitle] = useState('');
  const [newListingPrice, setNewListingPrice] = useState('');
  const [newListingDescription, setNewListingDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let storageId;
    if (selectedFile) {
      storageId = await uploadFile(selectedFile);
    }

    await createListing({
      title: newListingTitle,
      price: Number(newListingPrice),
      description: newListingDescription,
      storageId,
    });
    setShowCreateModal(false);
    setNewListingTitle('');
    setNewListingPrice('');
    setNewListingDescription('');
    setSelectedFile(null);
    setIsUploading(false);
  };

  const handleDelete = async (id: any) => {
    await deleteListing({ id });
  };

  if (agency === undefined || listings === undefined) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  if (!agency) {
    return <div className="p-8 text-center">Agency profile not found. Please contact support.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agency Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your storefront, listings, and leads.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
             <button onClick={() => window.open(`/agency/${agency._id}`, '_blank')} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
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
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
                <div className="relative h-48">
                  <img className="h-full w-full object-cover" src={listing.imageUrl} alt={listing.title} />
                </div>
                <div className="px-4 py-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{listing.title}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600">${listing.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between">
                   <button className="text-gray-500 hover:text-primary-600 font-medium text-sm flex items-center">
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                   </button>
                   <button onClick={() => handleDelete(listing._id)} className="text-red-400 hover:text-red-600 font-medium text-sm flex items-center">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                   </button>
                </div>
              </div>
            ))}
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required value={newListingDescription} onChange={e => setNewListingDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input required type="file" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isUploading} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
                  {isUploading ? 'Uploading...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
