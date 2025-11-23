import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Trash2, Wrench, Users, Camera, PenTool, Droplet, Zap, 
  Home as HouseIcon, Lock, Trees, BookOpen, Package, X, Plus, Edit2
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const PartnersTab = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('daglig-drift');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [formData, setFormData] = useState({
    category: 'daglig-drift',
    name: '',
    service: '',
    phone: '',
    email: '',
    additional_info: '',
    notes: ''
  });

  const ownerId = JSON.parse(localStorage.getItem('ownerProperty') || '{}').id;

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('digihome_partners_onboarding_seen');
    if (!hasSeenOnboarding) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
    }
    
    if (ownerId) {
      fetchPartners();
    }
  }, [ownerId]);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.sort((a, b) => 
            b.intersectionRatio - a.intersectionRatio
          )[0];
          setActiveSection(mostVisible.target.id);
        }
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
      }
    );

    setTimeout(() => {
      ['daglig-drift', 'profesjonelle', 'vedlikehold', 'spesialiserte'].forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 500);

    return () => observer.disconnect();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API}/api/partners/${ownerId}`);
      setPartners(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      setLoading(false);
    }
  };

  const handleAddPartner = async () => {
    try {
      const response = await axios.post(`${API}/api/partners/${ownerId}`, formData);
      setPartners([...partners, response.data]);
      closeModal();
      alert('Partner lagt til!');
    } catch (error) {
      console.error('Failed to add partner:', error);
      alert('Kunne ikke legge til partner. Prøv igjen.');
    }
  };

  const handleUpdatePartner = async () => {
    try {
      const response = await axios.put(
        `${API}/api/partners/${ownerId}/${selectedPartner.id}`,
        formData
      );
      setPartners(partners.map(p => p.id === selectedPartner.id ? response.data : p));
      closeModal();
      alert('Partner oppdatert!');
    } catch (error) {
      console.error('Failed to update partner:', error);
      alert('Kunne ikke oppdatere partner. Prøv igjen.');
    }
  };

  const handleDeletePartner = async (partnerId) => {
    if (!window.confirm('Er du sikker på at du vil slette denne partneren?')) return;
    
    try {
      await axios.delete(`${API}/api/partners/${ownerId}/${partnerId}`);
      setPartners(partners.filter(p => p.id !== partnerId));
      alert('Partner slettet!');
    } catch (error) {
      console.error('Failed to delete partner:', error);
      alert('Kunne ikke slette partner. Prøv igjen.');
    }
  };

  const openAddModal = (category) => {
    setModalMode('add');
    setFormData({
      category: category || 'daglig-drift',
      name: '',
      service: '',
      phone: '',
      email: '',
      additional_info: '',
      notes: ''
    });
    setShowModal(true);
  };

  const openEditModal = (partner) => {
    setModalMode('edit');
    setSelectedPartner(partner);
    setFormData({
      category: partner.category,
      name: partner.name,
      service: partner.service,
      phone: partner.phone,
      email: partner.email,
      additional_info: partner.additional_info || '',
      notes: partner.notes || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPartner(null);
  };

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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setSidebarOpen(false);
  };

  // Standard DigiHome sertifiserte partnere
  const standardPartners = [
    // Daglig drift
    { 
      id: 'standard-renhold', 
      category: 'daglig-drift', 
      subcategory: 'renhold',
      name: 'Nordisk Renhold AS', 
      service: 'Profesjonell rengjøring og vedlikehold',
      phone: '+47 22 00 00 00',
      email: 'kontakt@nordiskrenhold.no',
      status: 'DigiHome Sertifisert',
      notes: 'Erfaring med korttidsutleie',
      isStandard: true
    },
    { 
      id: 'standard-vaktmester', 
      category: 'daglig-drift', 
      subcategory: 'vaktmester',
      name: 'Oslo Vaktmestertjenester', 
      service: 'Vaktmester og driftsassistanse',
      phone: '+47 22 00 00 01',
      email: 'service@oslovaktmester.no',
      status: 'DigiHome Sertifisert',
      notes: 'Tilgjengelig 24/7',
      isStandard: true
    },
    { 
      id: 'standard-sengetoy', 
      category: 'daglig-drift', 
      subcategory: 'sengetoy',
      name: 'Premium Tekstil AS', 
      service: 'Sengetøy og håndklær',
      phone: '+47 22 00 00 02',
      email: 'ordre@premiumtekstil.no',
      status: 'DigiHome Sertifisert',
      notes: 'Kvalitetstekstiler for utleie',
      isStandard: true
    },
    // Profesjonelle tjenester
    { 
      id: 'standard-fotografer', 
      category: 'profesjonelle', 
      subcategory: 'fotografer',
      name: 'Studio Nordic', 
      service: 'Eiendomsfotografering',
      phone: '+47 22 00 00 03',
      email: 'booking@studionordic.no',
      status: 'DigiHome Sertifisert',
      notes: 'Spesialisert på Airbnb-annonser',
      isStandard: true
    },
    { 
      id: 'standard-interiordesign', 
      category: 'profesjonelle', 
      subcategory: 'interiordesign',
      name: 'Scandinavian Interiors', 
      service: 'Interiørdesign og styling',
      phone: '+47 22 00 00 04',
      email: 'post@scandinavianinteriors.no',
      status: 'DigiHome Sertifisert',
      notes: 'Moderne skandinavisk design',
      isStandard: true
    },
    // Vedlikehold
    { 
      id: 'standard-rorlegger', 
      category: 'vedlikehold', 
      subcategory: 'rorlegger',
      name: 'Akutt Rør Service', 
      service: 'Rørlegger og VVS-tjenester',
      phone: '+47 22 00 00 05',
      email: 'akutt@rorservice.no',
      status: 'DigiHome Sertifisert',
      notes: 'Akuttutrykning 24/7',
      isStandard: true
    },
    { 
      id: 'standard-elektriker', 
      category: 'vedlikehold', 
      subcategory: 'elektriker',
      name: 'Elektro Eksperten AS', 
      service: 'Elektriker og elektroinstallasjon',
      phone: '+47 22 00 00 06',
      email: 'service@elektroeksperten.no',
      status: 'DigiHome Sertifisert',
      notes: 'Autorisert elektroinstallatør',
      isStandard: true
    },
    { 
      id: 'standard-snekker', 
      category: 'vedlikehold', 
      subcategory: 'snekker',
      name: 'Mester Snekker', 
      service: 'Snekker og tømrertjenester',
      phone: '+47 22 00 00 07',
      email: 'post@mestersnekker.no',
      status: 'DigiHome Sertifisert',
      notes: 'Større og mindre reparasjoner',
      isStandard: true
    },
    { 
      id: 'standard-lasesmed', 
      category: 'vedlikehold', 
      subcategory: 'lasesmed',
      name: 'Sikker Lås & Nøkkel', 
      service: 'Låsesmed og sikkerhetstjenester',
      phone: '+47 22 00 00 08',
      email: 'hjelp@sikkerlås.no',
      status: 'DigiHome Sertifisert',
      notes: 'Akuttutrykning og låsbytte',
      isStandard: true
    },
    // Spesialiserte
    { 
      id: 'standard-hagearbeid', 
      category: 'spesialiserte', 
      subcategory: 'hagearbeid',
      name: 'Grønt Miljø AS', 
      service: 'Hagearbeid og uteområder',
      phone: '+47 22 00 00 09',
      email: 'post@grontmiljo.no',
      status: 'DigiHome Sertifisert',
      notes: 'Vedlikehold av hage og uteplasser',
      isStandard: true
    },
    { 
      id: 'standard-juridisk', 
      category: 'spesialiserte', 
      subcategory: 'juridisk',
      name: 'Eiendomsadvokaten', 
      service: 'Juridisk rådgivning for utleie',
      phone: '+47 22 00 00 10',
      email: 'advokat@eiendomsadvokaten.no',
      status: 'DigiHome Sertifisert',
      notes: 'Spesialist på utleierett',
      isStandard: true
    }
  ];

  const categories = [
    {
      id: 'daglig-drift',
      title: 'Daglig drift',
      desc: 'Essensielle tjenester for daglig drift av eiendommen',
      items: [
        { id: 'renhold', label: 'Renhold', icon: Trash2 },
        { id: 'vaktmester', label: 'Vaktmester', icon: Wrench },
        { id: 'sengetoy', label: 'Sengetøy', icon: Package }
      ]
    },
    {
      id: 'profesjonelle',
      title: 'Profesjonelle tjenester',
      desc: 'Spesialiserte tjenester for markedsføring og design',
      items: [
        { id: 'fotografer', label: 'Fotografer', icon: Camera },
        { id: 'interiordesign', label: 'Interiørdesign', icon: PenTool }
      ]
    },
    {
      id: 'vedlikehold',
      title: 'Vedlikehold & Reparasjoner',
      desc: 'Fagfolk for vedlikehold og akutte reparasjoner',
      items: [
        { id: 'rorlegger', label: 'Rørlegger', icon: Droplet },
        { id: 'elektriker', label: 'Elektriker', icon: Zap },
        { id: 'snekker', label: 'Snekker', icon: HouseIcon },
        { id: 'lasesmed', label: 'Låsesmed', icon: Lock }
      ]
    },
    {
      id: 'spesialiserte',
      title: 'Spesialiserte tjenester',
      desc: 'Nisjetjenester for særskilte behov',
      items: [
        { id: 'hagearbeid', label: 'Hagearbeid', icon: Trees },
        { id: 'juridisk', label: 'Juridisk rådgivning', icon: BookOpen }
      ]
    }
  ];

  const getIconForCategory = (categoryId) => {
    const allItems = categories.flatMap(c => c.items);
    const item = allItems.find(i => i.id === categoryId);
    return item ? item.icon : Users;
  };

  const getCategoryColor = (index) => {
    const colors = [
      { bg: 'bg-blue-50', color: 'text-blue-600' },
      { bg: 'bg-green-50', color: 'text-green-600' },
      { bg: 'bg-purple-50', color: 'text-purple-600' },
      { bg: 'bg-cyan-50', color: 'text-cyan-600' },
      { bg: 'bg-yellow-50', color: 'text-yellow-600' },
      { bg: 'bg-pink-50', color: 'text-pink-600' },
      { bg: 'bg-indigo-50', color: 'text-indigo-600' },
      { bg: 'bg-amber-50', color: 'text-amber-600' },
      { bg: 'bg-emerald-50', color: 'text-emerald-600' },
      { bg: 'bg-rose-50', color: 'text-rose-600' },
      { bg: 'bg-slate-50', color: 'text-slate-600' }
    ];
    return colors[index % colors.length];
  };

  // Kombiner standard partnere med brukerens egne partnere
  const groupedPartners = categories.map(cat => {
    const userPartners = partners.filter(p => p.category === cat.id);
    const defaultPartners = standardPartners.filter(p => p.category === cat.id);
    return {
      ...cat,
      partners: [...defaultPartners, ...userPartners]
    };
  });

  return (
    <div className="flex bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {sidebarOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-gray-200 fixed top-0 lg:top-[73px] bottom-0 overflow-y-auto z-40 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
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
            onClick={() => openAddModal()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Legg til partner
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {categories.map((category, idx) => (
            <div key={idx} className="mb-6">
              <button
                onClick={() => scrollToSection(category.id)}
                className={`w-full text-left text-xs font-bold uppercase tracking-wider mb-2 px-2 transition-colors ${
                  activeSection === category.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {category.title}
              </button>
              <ul className="space-y-1">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button 
                        onClick={() => scrollToSection(category.id)}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50"
                      >
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
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 pt-16 lg:pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">DigiHome Sertifiserte Partnere</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Oversikt over alle våre kvalitetssikrede samarbeidspartnere</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-4">Laster partnere...</p>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {groupedPartners.map((group, idx) => (
                <section key={idx} id={group.id} className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{group.title}</h2>
                      <p className="text-gray-600 text-sm sm:text-base mt-1">{group.desc}</p>
                    </div>
                    <button
                      onClick={() => openAddModal(group.id)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Legg til</span>
                    </button>
                  </div>

                  {group.partners.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-300 text-center">
                      <p className="text-gray-500 text-sm">Ingen partnere i denne kategorien enda.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {group.partners.map((partner, pIdx) => {
                        const Icon = getIconForCategory(partner.category);
                        const colors = getCategoryColor(pIdx);
                        
                        return (
                          <div
                            key={partner.id}
                            className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all group"
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-6 h-6 ${colors.color}`} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="font-bold text-base sm:text-lg text-gray-900">
                                    <span className="text-blue-600">DigiHome sertifisert</span> {partner.name}
                                  </h3>
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
                                    <span className="font-medium truncate block">{partner.additional_info || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0 mt-2 md:mt-0">
                                <button
                                  onClick={() => openEditModal(partner)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Rediger"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePartner(partner.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Slett"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {idx < groupedPartners.length - 1 && <hr className="border-gray-200 mt-8 sm:mt-12" />}
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Partner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === 'add' ? 'Legg til partner' : 'Rediger partner'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Navn *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tjeneste *</label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-post *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tilleggsinformasjon</label>
                <input
                  type="text"
                  value={formData.additional_info}
                  onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                  placeholder="F.eks. Responstid, erfaring, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notater</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  placeholder="Interne notater..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={modalMode === 'add' ? handleAddPartner : handleUpdatePartner}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                {modalMode === 'add' ? 'Legg til' : 'Oppdater'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center animate-fade-in">
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
                <button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg">
                  Neste
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 relative animate-slide-up">
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
                <button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg">
                  Neste
                </button>
              </div>
            </div>
          )}

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
                <button onClick={closeOnboarding} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg">
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