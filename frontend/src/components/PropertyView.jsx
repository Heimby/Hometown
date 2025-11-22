import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Calendar, FileText, Lock, ArrowLeft } from 'lucide-react';
import PropertyDocumentation from './PropertyDocumentation';

const PropertyView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('documentation');
  const [propertyData, setPropertyData] = useState(null);

  useEffect(() => {
    const savedProperty = localStorage.getItem('ownerProperty');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
  }, []);

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      locked: true,
      lockedMessage: 'Fullfør dokumentasjon først'
    },
    {
      id: 'inbox',
      label: 'Innboks',
      icon: MessageSquare,
      locked: true,
      lockedMessage: 'Fullfør dokumentasjon først'
    },
    {
      id: 'calendar',
      label: 'Kalender',
      icon: Calendar,
      locked: true,
      lockedMessage: 'Fullfør dokumentasjon først'
    },
    {
      id: 'documentation',
      label: 'Dokumentasjon',
      icon: FileText,
      locked: false
    }
  ];

  const handleTabClick = (tabId, isLocked) => {
    if (isLocked) {
      alert('Fullfør dokumentasjon før du får tilgang til denne funksjonen.');
      return;
    }
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'documentation':
        return <PropertyDocumentation />;
      case 'dashboard':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard kommer snart</h3>
              <p className="text-gray-600">Fullfør dokumentasjon for å låse opp denne funksjonen</p>
            </div>
          </div>
        );
      case 'inbox':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innboks kommer snart</h3>
              <p className="text-gray-600">Fullfør dokumentasjon for å låse opp denne funksjonen</p>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kalender kommer snart</h3>
              <p className="text-gray-600">Fullfør dokumentasjon for å låse opp denne funksjonen</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Top Navigation - Desktop */}
      <nav className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/owner-portal')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Tilbake til eiendommer
          </button>
          
          {propertyData && (
            <div className="flex items-center gap-3 pl-6 border-l border-gray-300">
              <Home className="w-5 h-5 text-gray-600" />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {propertyData.address?.split(',')[0] || 'Min Eiendom'}
                </h2>
                <p className="text-xs text-gray-500">{propertyData.address || ''}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.locked)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : tab.locked
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.locked && <Lock className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Header - REMOVED to avoid conflict with PropertyDocumentation's own header */}

      {/* Main Content */}
      <main className="pt-0 lg:mt-20">
        {renderTabContent()}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.locked)}
                className={`
                  flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50'
                    : tab.locked
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600'
                  }
                `}
              >
                <div className="relative">
                  <Icon className="w-6 h-6 mb-1" />
                  {tab.locked && (
                    <Lock className="w-3 h-3 absolute -top-1 -right-1 text-gray-400" />
                  )}
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default PropertyView;
