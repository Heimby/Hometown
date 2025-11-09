import React, { useState, useEffect } from 'react';
import { Home, TrendingUp, Calendar, Settings, LogOut, Plus, Search, Users, Bed, Bath } from 'lucide-react';

const OwnerPortalDashboard = () => {
  const [propertyData, setPropertyData] = useState(null);

  useEffect(() => {
    // Get property data from localStorage (saved during onboarding)
    const savedProperty = localStorage.getItem('ownerProperty');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('ownerProperty');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Portal Label */}
            <div className="flex items-center gap-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/ke4s6nwo_4633C819.svg" 
                alt="DigiHome Logo" 
                className="h-8"
              />
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium border border-emerald-200">
                Owner Portal
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-6">
              <a href="/owner-portal" className="flex items-center gap-2 text-emerald-600 font-medium">
                <Home size={18} />
                <span>Properties</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <TrendingUp size={18} />
                <span>Analytics</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Calendar size={18} />
                <span>Calendar</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Settings size={18} />
                <span>Settings</span>
              </a>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        {/* Page Title and Search */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Properties</h1>
          <p className="text-gray-600 text-lg">Manage and monitor your Airbnb listings</p>
        </div>

        {/* Search and Add Property */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search properties by address or name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button className="ml-4 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            <Plus size={20} />
            <span>Add New Property</span>
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Properties */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Properties</p>
                <p className="text-4xl font-bold text-gray-900">1</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Home size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Active Listings */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Listings</p>
                <p className="text-4xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Monthly Revenue</p>
                <p className="text-4xl font-bold text-gray-900">$0</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-2xl font-bold text-yellow-600">$</span>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
                <p className="text-4xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Property Listing Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 text-sm font-medium text-gray-600 uppercase tracking-wide">
            <div className="col-span-6">Property</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Property Card */}
          {propertyData ? (
            <div className="px-6 py-6">
              <div className="flex items-center gap-6">
                {/* Property Image */}
                <div className="flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
                    alt="Property"
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Property Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {propertyData.address?.split(',')[0] || 'Modern Downtown Apartment'}
                  </h3>
                  <p className="text-gray-600 mb-2 flex items-center gap-2">
                    <Home size={16} />
                    {propertyData.address || '123 Main Street, Austin, TX'}
                  </p>
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      4 guests
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed size={16} />
                      2 bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={16} />
                      2 bath
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200">
                    ● Draft
                  </span>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
                    Check How Much You Can Earn
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <p>No properties found. Add your first property to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerPortalDashboard;
