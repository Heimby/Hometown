import React, { useState, useEffect } from 'react';
import { 
  Trash2, Wrench, Users, Camera, PenTool, Droplet, Zap, 
  Home as HouseIcon, Lock, Trees, BookOpen, Package
} from 'lucide-react';

const PartnersTab = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('digihome_partners_onboarding_seen');
    if (!hasSeenOnboarding) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
    }
  }, []);

  const closeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('digihome_partners_onboarding_seen', 'true');
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      closeOnboarding();
    }
  };

  // Partner categories for sidebar
  const categories = [
    {
      title: 'Daglig drift',
      items: [
        { id: 'renhold', label: 'Renhold', icon: Trash2 },
        { id: 'vaktmester', label: 'Vaktmester', icon: Wrench },
        { id: 'sengetoy', label: 'Sengetøy', icon: Package }
      ]
    },
    {
      title: 'Profesjonelle tjenester',
      items: [
        { id: 'fotografer', label: 'Fotografer', icon: Camera },
        { id: 'interiordesign', label: 'Interiørdesign', icon: PenTool }
      ]
    },
    {
      title: 'Vedlikehold & Reparasjoner',
      items: [
        { id: 'rorlegger', label: 'Rørlegger', icon: Droplet },
        { id: 'elektriker', label: 'Elektriker', icon: Zap },
        { id: 'snekker', label: 'Snekker', icon: HouseIcon },
        { id: 'lasesmed', label: 'Låsesmed', icon: Lock }
      ]
    },
    {
      title: 'Spesialiserte tjenester',
      items: [
        { id: 'hagearbeid', label: 'Hagearbeid', icon: Trees },
        { id: 'juridisk', label: 'Juridisk rådgivning', icon: BookOpen }
      ]
    }
  ];

  // Mock partner data
  const partners = [
    {
      id: 1,
      category: 'Daglig drift',
      name: 'DigiHome Sertifisert Renhold',
      service: 'Profesjonell rengjøring',
      phone: '+47 123 45 678',
      email: 'renhold@partner.no',
      response: 'Innen 24t',
      icon: Trash2,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      status: 'Aktiv'
    },
    {
      id: 2,
      category: 'Daglig drift',
      name: 'DigiHome Sertifisert Vaktmester',
      service: 'Vedlikehold & reparasjoner',
      phone: '+47 234 56 789',
      email: 'vaktmester@partner.no',
      response: 'Samme dag',
      icon: Wrench,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      status: 'Aktiv'
    },
    {
      id: 3,
      category: 'Daglig drift',
      name: 'DigiHome Sertifisert Sengetøy',
      service: 'Tekstilservice',
      phone: '+47 678 90 123',
      email: 'sengetoy@partner.no',
      response: 'Samme dag',
      icon: Package,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-600',
      status: 'Aktiv'
    },
    {
      id: 4,
      category: 'Profesjonelle tjenester',
      name: 'DigiHome Sertifisert Fotograf',
      service: 'Eiendomsfotografering',
      phone: '+47 345 67 890',
      email: 'foto@partner.no',
      response: '48 timer',
      icon: Camera,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      status: 'Aktiv'
    },
    {
      id: 5,
      category: 'Profesjonelle tjenester',
      name: 'DigiHome Sertifisert Interiørdesign',
      service: 'Interiørdesign & styling',
      phone: '+47 789 01 234',
      email: 'design@partner.no',
      response: 'Gratis',
      icon: PenTool,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      status: 'Aktiv'
    },
    {
      id: 6,
      category: 'Vedlikehold & Reparasjoner',
      name: 'DigiHome Sertifisert Rørlegger',
      service: 'VVS & sanitær',
      phone: '+47 456 78 901',
      email: 'ror@partner.no',
      response: '24/7',
      icon: Droplet,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      status: 'Aktiv'
    },
    {
      id: 7,
      category: 'Vedlikehold & Reparasjoner',
      name: 'DigiHome Sertifisert Elektriker',
      service: 'Elektroinstallasjon',
      phone: '+47 567 89 012',
      email: 'elektro@partner.no',
      response: 'Autorisert',
      icon: Zap,
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      status: 'Aktiv'
    },
    {
      id: 8,
      category: 'Vedlikehold & Reparasjoner',
      name: 'DigiHome Sertifisert Snekker',
      service: 'Snekkerarbeid',
      phone: '+47 890 12 345',
      email: 'snekker@partner.no',
      response: '15+ år',
      icon: HouseIcon,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      status: 'Aktiv'
    },
    {
      id: 9,
      category: 'Vedlikehold & Reparasjoner',
      name: 'DigiHome Sertifisert Låsesmed',
      service: 'Låsservice & sikkerhet',
      phone: '+47 901 23 456',
      email: 'las@partner.no',
      response: '24/7',
      icon: Lock,
      iconBg: 'bg-slate-50',
      iconColor: 'text-slate-600',
      status: 'Aktiv'
    },
    {
      id: 10,
      category: 'Spesialiserte tjenester',
      name: 'DigiHome Sertifisert Hagearbeid',
      service: 'Hageomsorg & design',
      phone: '+47 012 34 567',
      email: 'hage@partner.no',
      response: 'Mars-Oktober',
      icon: Trees,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      status: 'Aktiv'
    },
    {
      id: 11,
      category: 'Spesialiserte tjenester',
      name: 'DigiHome Sertifisert Juridisk rådgivning',
      service: 'Juridisk bistand',
      phone: '+47 123 45 678',
      email: 'jus@partner.no',
      response: 'Eiendomsrett',
      icon: BookOpen,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      status: 'Aktiv'
    }
  ];

  const groupedPartners = [
    { title: 'Daglig drift', desc: 'Essensielle tjenester for daglig drift av eiendommen', partners: partners.filter(p => p.category === 'Daglig drift') },
    { title: 'Profesjonelle tjenester', desc: 'Spesialiserte tjenester for markedsføring og design', partners: partners.filter(p => p.category === 'Profesjonelle tjenester') },
    { title: 'Vedlikehold & Reparasjoner', desc: 'Fagfolk for vedlikehold og akutte reparasjoner', partners: partners.filter(p => p.category === 'Vedlikehold & Reparasjoner') },
    { title: 'Spesialiserte tjenester', desc: 'Nisjetjenester for særskilte behov', partners: partners.filter(p => p.category === 'Spesialiserte tjenester') }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
              </svg>
            </div>
            <span className="font-bold text-xl">DigiHome</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Partnerportal</p>
        </div>

        {/* Search & Add Partner */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Søk etter partnere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5 text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <button
            id="sidebar-add-partner-btn"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Legg til partner
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {categories.map((category, idx) => (
            <div key={idx} className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">{category.title}</p>
              <ul className="space-y-1">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">DigiHome Sertifiserte Partnere</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Oversikt over alle våre kvalitetssikrede samarbeidspartnere for Airbnb-forvaltning</p>
          </div>

          {/* Partner List with Sections */}
          <div className="space-y-12 sm:space-y-16">
            {groupedPartners.map((group, idx) => (
              <section key={idx} id={`section-${idx}`} className="scroll-mt-24">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{group.title}</h2>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{group.desc}</p>

                <div className="flex flex-col gap-4">
                  {group.partners.map((partner) => {
                    const Icon = partner.icon;
                    return (
                      <div
                        key={partner.id}
                        className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-500 transition-all group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className={`w-12 h-12 ${partner.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-6 h-6 ${partner.iconColor}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="font-bold text-base sm:text-lg text-gray-900">{partner.name}</h3>
                              <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded font-semibold border border-green-100">
                                {partner.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                              <div className="min-w-0">
                                <span className="text-gray-500 text-xs block">Tjeneste</span>
                                <span className="font-medium truncate block">{partner.service}</span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-gray-500 text-xs block">Telefon</span>
                                <span className="font-medium truncate block">{partner.phone}</span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-gray-500 text-xs block">E-post</span>
                                <span className="font-medium truncate block">{partner.email}</span>
                              </div>
                              <div className="min-w-0">
                                <span className="text-gray-500 text-xs block">Info</span>
                                <span className="font-medium truncate block">{partner.response}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0 mt-2 md:mt-0">
                            <span className="text-blue-600 text-sm font-semibold group-hover:underline flex items-center gap-1">
                              Se detaljer
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {idx < groupedPartners.length - 1 && <hr className="border-gray-200 mt-8 sm:mt-12" />}
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 animate-slide-up">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Velkommen til vår partnerportal</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">
                  Her har du oversikt over alle DigiHome-tjenester som vi leverer. Ved å bruke digihome sine sertifiserte leverandører, så har du ekstra garantier som renholdsgaranti og vedlikeholdsgaranti.
                </p>
                <button
                  onClick={nextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  Neste
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Add Partner */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 relative animate-slide-up">
              {/* Arrow pointing to sidebar (Desktop only) */}
              <div className="absolute -left-16 -top-10 hidden lg:block" style={{ animation: 'bounce-point 2s infinite' }}>
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M90 90 C 50 90, 20 60, 10 20" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 5"/>
                  <path d="M10 20 L 5 35 M 10 20 L 25 25" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Legg til dine egne partnere</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">
                  Vi er en global tjeneste, men vi kan ikke være overalt. Du kan legge inn dine egne foretrukne samarbeidspartnere her ved å trykke 'Legg til partner'.
                </p>
                <button
                  onClick={nextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  Neste
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Communication */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 animate-slide-up">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                    <path d="M12 18h.01"></path>
                  </svg>
                  <div className="absolute -top-1 -right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm transform rotate-12">SMS</div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">På farten?</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">
                  Husk at du kan alltid kommunisere med din digitale eiendomsforvalter via din foretrukne kommunikasjonsmetode. Bare send melding, så legger jeg inn samarbeidspartneren i portalen.
                </p>
                <button
                  onClick={closeOnboarding}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                >
                  Ferdig
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-point {
          0%, 100% { transform: translate(0, 0) rotate(-10deg); }
          50% { transform: translate(-5px, -5px) rotate(-10deg); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PartnersTab;
