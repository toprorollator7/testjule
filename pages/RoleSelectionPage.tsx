import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Home } from 'lucide-react';
import { mockApi } from '../lib/mockApi';
import { UserRole } from '../types';

interface RoleSelectionPageProps {
  userId: string;
  onRoleUpdate: () => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ userId, onRoleUpdate }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelection = async (role: UserRole) => {
    setLoading(role);
    try {
      await mockApi.updateUserRole(userId, role);
      onRoleUpdate(); // Refresh user state in App
      if (role === UserRole.PROVIDER_ADMIN) {
        navigate('/dashboard');
      } else {
        navigate('/browse');
      }
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">How do you plan to use AgentFlow?</h2>
          <p className="mt-2 text-sm text-gray-600">This helps us customize your experience. You cannot change this later.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Provider Card */}
          <button
            onClick={() => handleSelection(UserRole.PROVIDER_ADMIN)}
            disabled={!!loading}
            className={`relative group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary-500 hover:shadow-lg transition-all text-left ${loading === UserRole.PROVIDER_ADMIN ? 'opacity-70 cursor-wait' : ''}`}
          >
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
              <Briefcase className="h-6 w-6 text-primary-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">I am an Agency / Agent</h3>
            <p className="mt-2 text-gray-500">
              Create a branded storefront, list properties, and manage incoming leads.
            </p>
          </button>

          {/* Consumer Card */}
          <button
            onClick={() => handleSelection(UserRole.CONSUMER)}
            disabled={!!loading}
            className={`relative group bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary-500 hover:shadow-lg transition-all text-left ${loading === UserRole.CONSUMER ? 'opacity-70 cursor-wait' : ''}`}
          >
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
              <Home className="h-6 w-6 text-green-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">I am looking for a Home</h3>
            <p className="mt-2 text-gray-500">
              Browse listings, contact agents, and find your dream property.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};