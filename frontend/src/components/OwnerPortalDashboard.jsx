import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Calendar, Settings, LogOut, Plus, Search, Users, Bed, Bath, X } from 'lucide-react';
import PropertyOnboardingModal from './PropertyOnboardingModal';
import PartnersTab from './PartnersTab';

const OwnerPortalDashboard = () => {
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProfileVerificationModal, setShowProfileVerificationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');

  useEffect(() => {
    const savedProperty = localStorage.getItem('ownerProperty');
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    const completedOnboarding = localStorage.getItem('completedOnboarding');
    
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
    
    // Show welcome modal only on first visit
    if (!hasSeenWelcome && savedProperty) {
      setShowWelcomeModal(true);
    }
    
    setHasCompletedOnboarding(!!completedOnboarding);
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handlePropertyClick = () => {
    if (!hasCompletedOnboarding) {
      setShowOnboardingModal(true);
    } else {
      // Show verification modal with option to go to documentation
      setShowVerificationModal(true);
    }
  };

  const handleFeatureClick = (e) => {
    e.preventDefault();
    if (hasCompletedOnboarding) {
      setShowProfileVerificationModal(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboardingModal(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem('completedOnboarding', 'true');
  };

  const handleSignOut = () => {
    localStorage.removeItem('ownerProperty');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in relative">
            <button
              onClick={handleCloseWelcome}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Velkommen til DigiHome!
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Basert på lignende boliger i ditt område, anslår vi at vi kan utbetale{' '}
                <span className="font-bold text-emerald-600">36 381 kr</span> i løpet av sommermånedene.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Fyll ut "sjekk ditt inntektspotensial" for å få et mer nøyaktig estimat for hele året.
              </p>
              <button
                onClick={handleCloseWelcome}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Kom i gang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      <PropertyOnboardingModal
        isOpen={showOnboardingModal}
        onClose={handleOnboardingComplete}
        propertyData={propertyData}
      />
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
              <button 
                onClick={() => setActiveTab('properties')}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  activeTab === 'properties' ? 'text-emerald-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home size={18} />
                <span>Eiendommer</span>
              </button>
              <button 
                onClick={() => setActiveTab('partners')}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  activeTab === 'partners' ? 'text-emerald-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users size={18} />
                <span>Samarbeidspartnere</span>
              </button>
              <a 
                href="#" 
                onClick={handleFeatureClick}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <TrendingUp size={18} />
                <span>Analyser</span>
              </a>
              <a 
                href="#" 
                onClick={handleFeatureClick}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Calendar size={18} />
                <span>Kalender</span>
              </a>
              <a 
                href="#" 
                onClick={handleFeatureClick}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
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

      <main className={activeTab === 'partners' ? '' : 'px-4 sm:px-8 py-6 sm:py-8'}>
        {activeTab === 'properties' && (
          <>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Dine Eiendommer</h1>
          <p className="hidden lg:block text-gray-600 text-lg">Administrer og overvåk dine Airbnb-annonser</p>
        </div>

        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Søk etter eiendommer..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <button 
            onClick={handleFeatureClick}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap text-sm"
          >
            <Plus size={18} />
            <span className="lg:hidden">Legg til ny</span>
            <span className="hidden lg:inline">Legg Til Ny Eiendom</span>
          </button>
        </div>

        {/* Dashboard Stats - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:grid grid-cols-4 gap-6 mb-8">
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

        {/* Properties Section Title - Mobile only */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 lg:hidden">Mine Eiendommer</h2>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 text-sm font-medium text-gray-600 uppercase tracking-wide">
            <div className="col-span-6">Eiendom</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Handlinger</div>
          </div>

          {propertyData ? (
            <div className="p-4 sm:p-6">
              <div 
                onClick={handlePropertyClick}
                className={`flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 cursor-pointer transition-all ${
                  !hasCompletedOnboarding ? 'hover:bg-gray-50 rounded-xl p-4 -m-4 animate-pulse-slow' : ''
                }`}
              >
                <div className="flex-shrink-0 w-full sm:w-auto relative">
                  <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
                    alt="Eiendom"
                    className="w-full sm:w-32 h-48 sm:h-24 object-cover rounded-lg"
                  />
                  {!hasCompletedOnboarding && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {propertyData.address?.split(',')[0] || 'Moderne Sentrumsbo'}
                  </h3>
                  <p className="text-gray-600 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Home size={16} />
                    <span className="truncate">{propertyData.address || '123 Main Street, Austin, TX'}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="sm:w-4 sm:h-4" />
                      4 gjester
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed size={14} className="sm:w-4 sm:h-4" />
                      2 soverom
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={14} className="sm:w-4 sm:h-4" />
                      2 bad
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto">
                  <span className="inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200 whitespace-nowrap">
                    ● Kladd
                  </span>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePropertyClick();
                    }}
                    className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
                      !hasCompletedOnboarding 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse-slow' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {!hasCompletedOnboarding ? 'Fullfør registrering' : 'Sjekk Inntektspotensial'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500">
              <p className="text-sm sm:text-base">Ingen eiendommer funnet. Legg til din første eiendom for å komme i gang!</p>
            </div>
          )}
        </div>
        </>
        )}

        {activeTab === 'partners' && <PartnersTab />}
      </main>

      {/* Verification in Progress Modal (after completing onboarding) */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-scale-in relative">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vi analyserer din eiendom
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Vårt team holder på å verifisere detaljene du har lagt inn og analysere hva vi tror boligen din kan tjene.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dette er en del av vår pre-launch-fase hvor vi kartlegger interessen for tjenesten i Norge. Du vil motta en e-post med et detaljert inntektsestimat innen <span className="font-semibold">24-48 timer</span>.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Hva skjer nå?</strong><br />
                  • Vi verifiserer eiendommens detaljer<br />
                  • Vi analyserer markedsdata i ditt område<br />
                  • Vi beregner inntektspotensial basert på lignende boliger<br />
                  • Du får en komplett rapport på e-post
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowVerificationModal(false);
                    navigate('/owner-portal/property');
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Åpne eiendom
                </button>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Lukk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Verification Modal (for other features) */}
      {showProfileVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in relative">
            <button
              onClick={() => setShowProfileVerificationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-orange-600 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vi holder på å verifisere din profil
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Denne funksjonen vil bli tilgjengelig når verifiseringen av eiendommen din er fullført. Du vil motta en e-post når alt er klart!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Dette er en del av vår pre-launch-fase. Vi sørger for at alt er satt opp riktig før du får tilgang til alle funksjoner.
              </p>
              <button
                onClick={() => setShowProfileVerificationModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="grid grid-cols-4 gap-1">
          {/* Eiendommer */}
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
              activeTab === 'properties' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span>Eiendommer</span>
          </button>

          {/* Samarbeidspartnere */}
          <button
            onClick={() => setActiveTab('partners')}
            className={`flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
              activeTab === 'partners' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Users className="w-6 h-6 mb-1" />
            <span>Partnere</span>
          </button>

          {/* Analyser */}
          <button
            onClick={handleFeatureClick}
            className="flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors text-gray-600"
          >
            <TrendingUp className="w-6 h-6 mb-1" />
            <span>Analyser</span>
          </button>

          {/* Innstillinger */}
          <button
            onClick={handleFeatureClick}
            className="flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors text-gray-600"
          >
            <Settings className="w-6 h-6 mb-1" />
            <span>Innstillinger</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default OwnerPortalDashboard;