import React, { useState, useEffect } from 'react';
import { Home, TrendingUp, Calendar, Settings, LogOut, Plus, Search, Users, Bed, Bath } from 'lucide-react';

const OwnerPortalDashboard = () => {
  const [propertyData, setPropertyData] = useState(null);

  useEffect(() => {
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/ke4s6nwo_4633C819.svg" 
                alt="DigiHome Logo" 
                className="h-6 sm:h-8"
              />
              <span className="px-2 sm:px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs sm:text-sm font-medium border border-emerald-200">
                Eierportal
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <a href="/owner-portal" className="flex items-center gap-2 text-emerald-600 font-medium">
                <Home size={18} />
                <span>Eiendommer</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <TrendingUp size={18} />
                <span>Analyser</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Calendar size={18} />
                <span>Kalender</span>
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Settings size={18} />
                <span>Innstillinger</span>
              </a>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut size={18} />
                <span>Logg Ut</span>
              </button>
            </nav>

            {/* Mobile Sign Out Button */}
            <button 
              onClick={handleSignOut}
              className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logg Ut</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Dine Eiendommer</h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Administrer og overvåk dine Airbnb-annonser</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Søk etter eiendommer..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base">
            <Plus size={20} />
            <span className="hidden sm:inline">Legg Til Ny Eiendom</span>
            <span className="sm:hidden">Legg Til</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Totalt Eiendommer</p>
                <p className="text-4xl font-bold text-gray-900">1</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Home size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Aktive Annonser</p>
                <p className="text-4xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Månedlige Inntekter</p>
                <p className="text-4xl font-bold text-gray-900">0 kr</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-2xl font-bold text-yellow-600">kr</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Totalt Bookinger</p>
                <p className="text-4xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 text-sm font-medium text-gray-600 uppercase tracking-wide">
            <div className="col-span-6">Eiendom</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Handlinger</div>
          </div>

          {propertyData ? (
            <div className="px-6 py-6">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
                    alt="Eiendom"
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {propertyData.address?.split(',')[0] || 'Moderne Sentrumsbo'}
                  </h3>
                  <p className="text-gray-600 mb-2 flex items-center gap-2">
                    <Home size={16} />
                    {propertyData.address || '123 Main Street, Austin, TX'}
                  </p>
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      4 gjester
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed size={16} />
                      2 soverom
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={16} />
                      2 bad
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200">
                    ● Kladd
                  </span>
                </div>

                <div className="flex-shrink-0">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
                    Sjekk Hvor Mye Du Kan Tjene
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-500">
              <p>Ingen eiendommer funnet. Legg til din første eiendom for å komme i gang!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerPortalDashboard;