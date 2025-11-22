import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Download, Plus, X, Upload, File, 
  Image as ImageIcon, Trash2, Activity, Edit2, Save, Zap,
  Droplet, Flame, Clock, Settings, AlertTriangle, DoorOpen
} from 'lucide-react';
import axios from 'axios';
import AccessAndLocksTab from './AccessAndLocksTab';
import FloorPlanTab from './FloorPlanTab';
import FurnitureEquipmentTab from './FurnitureEquipmentTab';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Standard systems that should be pre-populated
const STANDARD_SYSTEMS = [
  { 
    id: 'sikringsskap',
    name: 'Sikringsskap',
    icon: Zap,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    fields: ['Plassering', 'Type', 'Installatør', 'Sist kontrollert']
  },
  { 
    id: 'vannstoppsystem',
    name: 'Vannstoppsystem',
    icon: Droplet,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    fields: ['Plassering', 'Type', 'Installatør', 'Sist kontrollert']
  },
  { 
    id: 'roykvarslere',
    name: 'Røykvarslere',
    icon: AlertTriangle,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    fields: ['Antall enheter', 'Type', 'Installatør', 'Sist kontrollert']
  },
  { 
    id: 'komfyrvakt',
    name: 'Komfyrvakt',
    icon: Clock,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    fields: ['Plassering', 'Type', 'Installatør', 'Sist kontrollert']
  },
  { 
    id: 'hovedstoppekran',
    name: 'Hovedstoppekran',
    icon: Settings,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    fields: ['Plassering', 'Type', 'Størrelse', 'Tilstand']
  },
  { 
    id: 'brannslukningsapparat',
    name: 'Brannslukningsapparat',
    icon: Flame,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    fields: ['Plassering', 'Type', 'Størrelse', 'Sist kontrollert']
  },
  { 
    id: 'nodutganger',
    name: 'Nødutganger',
    icon: DoorOpen,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    fields: ['Hovedutgang', 'Alternativ utgang', 'Vinduer', 'Tilstand']
  },
  { 
    id: 'varmtvannstank',
    name: 'Varmtvannstank',
    icon: Droplet,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    fields: ['Plassering', 'Type', 'Størrelse', 'Sist kontrollert']
  }
];

const PropertyDocumentation = () => {
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [securitySystems, setSecuritySystems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  // Overview data state
  const [overviewData, setOverviewData] = useState({
    wifiName: '',
    wifiPassword: '',
    accountNumber: ''
  });
  const [editingOverview, setEditingOverview] = useState(false);

  useEffect(() => {
    const savedProperty = localStorage.getItem('ownerProperty');
    if (savedProperty) {
      const data = JSON.parse(savedProperty);
      setPropertyData(data);
      fetchOwnerData(data.id);
      initializeStandardSystems(data.id);
    }
  }, []);

  const fetchOwnerData = async (ownerId) => {
    try {
      const response = await axios.get(`${API}/owners/${ownerId}`);
      if (response.data.onboarding_data) {
        setPropertyData(prev => ({
          ...prev,
          onboarding_data: response.data.onboarding_data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch owner data:', error);
    }
  };

  const initializeStandardSystems = async (ownerId) => {
    try {
      const response = await axios.get(`${API}/owners/${ownerId}/documentation/security-systems`);
      
      // Check which standard systems are missing
      const existingSystemNames = response.data.map(sys => sys.name);
      const missingSystemsData = STANDARD_SYSTEMS
        .filter(sys => !existingSystemNames.includes(sys.name))
        .map(sys => ({
          name: sys.name,
          category: 'security_systems',
          location: '',
          system_type: '',
          last_checked: '',
          installed_date: '',
          installer: '',
          description: '',
          notes: ''
        }));
      
      // Only create missing systems
      if (missingSystemsData.length > 0) {
        for (const system of missingSystemsData) {
          await axios.post(`${API}/owners/${ownerId}/documentation/security-systems`, system);
        }
        
        // Fetch again to get all systems including newly created ones
        const newResponse = await axios.get(`${API}/owners/${ownerId}/documentation/security-systems`);
        setSecuritySystems(newResponse.data);
      } else {
        setSecuritySystems(response.data);
      }
    } catch (error) {
      console.error('Failed to initialize systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/owner-portal');
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setEditData({
      location: item.location || '',
      system_type: item.system_type || '',
      installer: item.installer || '',
      last_checked: item.last_checked || '',
      installed_date: item.installed_date || '',
      description: item.description || '',
      notes: item.notes || ''
    });
    setEditMode(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setEditMode(false);
    setEditData({});
  };

  const handleSaveSystem = async () => {
    try {
      await axios.put(
        `${API}/owners/${propertyData.id}/documentation/security-systems/${selectedItem.id}`,
        editData
      );
      
      // Update local state
      setSecuritySystems(prev => prev.map(sys => 
        sys.id === selectedItem.id ? { ...sys, ...editData } : sys
      ));
      setSelectedItem({ ...selectedItem, ...editData });
      setEditMode(false);
      alert('Systemet ble oppdatert!');
    } catch (error) {
      console.error('Failed to update system:', error);
      alert('Kunne ikke oppdatere systemet. Prøv igjen.');
    }
  };

  const handleSaveOverview = () => {
    // Save to localStorage for now
    const updatedData = {
      ...propertyData,
      wifiName: overviewData.wifiName,
      wifiPassword: overviewData.wifiPassword,
      accountNumber: overviewData.accountNumber
    };
    localStorage.setItem('ownerProperty', JSON.stringify(updatedData));
    setPropertyData(updatedData);
    setEditingOverview(false);
    alert('Informasjonen ble lagret!');
  };

  const getSystemIcon = (systemName) => {
    const system = STANDARD_SYSTEMS.find(s => s.name === systemName);
    if (!system) return Shield;
    return system.icon;
  };

  const getSystemColors = (systemName) => {
    const system = STANDARD_SYSTEMS.find(s => s.name === systemName);
    if (!system) return { iconBg: 'bg-blue-50', iconColor: 'text-blue-600' };
    return { iconBg: system.iconBg, iconColor: system.iconColor };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">DigiHome</span>
          </div>
          <p className="text-sm text-gray-600 mt-2 break-words">
            {propertyData?.address || 'Laster adresse...'}
          </p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {/* DASHBOARD */}
            <li className="px-2 py-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dashboard</p>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Oversikt
              </button>
            </li>

            {/* INFRASTRUKTUR */}
            <li className="px-2 py-2 mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Infrastruktur</p>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('access')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'access'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
                Adgang & Låser
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'security'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Sikkerhet & Systemer
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('electronics')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'electronics'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
                Elektronikk & Hvitevarer
              </button>
            </li>

            {/* INVENTAR */}
            <li className="px-2 py-2 mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inventar</p>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('furniture')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'furniture'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/>
                </svg>
                Møbler & Utstyr
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('instructions')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === 'instructions'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Instruksjoner & Manualer</span>
              </button>
            </li>

            {/* DIGITAL INTERFACE */}
            <li className="px-2 py-2 mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Digital Interface</p>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('floor-plan')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'floor-plan'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                Planløsning
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('3d-map')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === '3d-map'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                </svg>
                3D Romkart
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('database')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'database'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                Objektdatabase
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tilbake til eiendommer
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            {(() => {
              switch(activeTab) {
                case 'overview': return 'Oversikt';
                case 'access': return 'Adgang & Låser';
                case 'security': return 'Sikkerhet & Systemer';
                case 'electronics': return 'Elektronikk & Hvitevarer';
                case 'furniture': return 'Møbler & Utstyr';
                case 'instructions': return 'Instruksjoner & Manualer';
                case 'floor-plan': return 'Planløsning';
                case '3d-map': return '3D Romkart';
                case 'database': return 'Objektdatabase';
                default: return 'Oversikt';
              }
            })()}
          </h1>
          <p className="text-gray-600 mt-2">
            {(() => {
              switch(activeTab) {
                case 'overview': return 'All informasjon om eiendommen';
                case 'access': return 'Komplett dokumentasjon av innlåsingsmetoder og navigasjon';
                case 'security': return 'Klikk på et system for å legge til informasjon';
                case 'electronics': return 'Oversikt over elektroniske enheter og hvitevarer';
                case 'furniture': return 'Inventar og utstyr i eiendommen';
                case 'instructions': return 'Brukermanualer og instruksjoner';
                case 'floor-plan': return 'Last opp planløsning og legg til kommentarer';
                case '3d-map': return 'Interaktivt 3D-kart over eiendommen';
                case 'database': return 'Søkbar database over alle objekter';
                default: return 'All informasjon om eiendommen';
              }
            })()}
          </p>
        </div>

        {/* Content */}
        {activeTab === 'overview' && propertyData && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Eiendomsinformasjon</h2>
                {!editingOverview ? (
                  <button
                    onClick={() => setEditingOverview(true)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Rediger
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveOverview}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Lagre
                    </button>
                    <button
                      onClick={() => setEditingOverview(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Avbryt
                    </button>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Grunnleggende informasjon</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Adresse</p>
                    <p className="font-semibold">{propertyData.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Eier</p>
                    <p className="font-semibold">{propertyData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">E-post</p>
                    <p className="font-semibold">{propertyData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Telefon</p>
                    <p className="font-semibold">{propertyData.phone}</p>
                  </div>
                </div>
              </div>

              {/* Onboarding Data */}
              {propertyData.onboarding_data && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Eiendomsdetaljer</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Type eiendom</p>
                      <p className="font-semibold capitalize">{propertyData.onboarding_data.property_type === 'apartment' ? 'Leilighet' : 'Hus'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Eierform</p>
                      <p className="font-semibold capitalize">{propertyData.onboarding_data.ownership_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Utleiestrategi</p>
                      <p className="font-semibold">{propertyData.onboarding_data.rental_strategy === 'short' ? 'Korttidsutleie' : propertyData.onboarding_data.rental_strategy === 'long' ? 'Langtidsutleie' : 'Dynamisk'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Parkering</p>
                      <p className="font-semibold capitalize">{propertyData.onboarding_data.parking === 'none' ? 'Ingen' : propertyData.onboarding_data.parking === 'free' ? 'Gratis' : 'Garasje'}</p>
                    </div>
                    {propertyData.onboarding_data.rooms && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Soverom</p>
                          <p className="font-semibold">{propertyData.onboarding_data.rooms.bedroom?.length || 0} stk</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Bad</p>
                          <p className="font-semibold">{propertyData.onboarding_data.rooms.bathroom?.length || 0} stk</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* WiFi Info */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">WiFi-informasjon</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">WiFi-navn</label>
                    {editingOverview ? (
                      <input
                        type="text"
                        value={overviewData.wifiName}
                        onChange={(e) => setOverviewData(prev => ({ ...prev, wifiName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Skriv inn WiFi-navn"
                      />
                    ) : (
                      <p className="font-semibold">{propertyData.wifiName || 'Ikke angitt'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">WiFi-passord</label>
                    {editingOverview ? (
                      <input
                        type="text"
                        value={overviewData.wifiPassword}
                        onChange={(e) => setOverviewData(prev => ({ ...prev, wifiPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Skriv inn WiFi-passord"
                      />
                    ) : (
                      <p className="font-semibold">{propertyData.wifiPassword || 'Ikke angitt'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Info */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Bankinformasjon</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Kontonummer for utbetaling</label>
                    {editingOverview ? (
                      <input
                        type="text"
                        value={overviewData.accountNumber}
                        onChange={(e) => setOverviewData(prev => ({ ...prev, accountNumber: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="xxxx.xx.xxxxx"
                      />
                    ) : (
                      <p className="font-semibold">{propertyData.accountNumber || 'Ikke angitt'}</p>
                    )}
                  </div>
                </div>
              </div>

              {propertyData.onboarding_completed && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✓ Onboarding fullført
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-4">Laster systemer...</p>
              </div>
            ) : securitySystems.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Ingen sikkerhetssystemer funnet</p>
              </div>
            ) : (
              securitySystems.map((item) => {
                const IconComponent = getSystemIcon(item.name);
                const colors = getSystemColors(item.name);
                const hasData = item.location || item.system_type;
                
                return (
                  <div
                    key={item.id}
                    onClick={() => openItemModal(item)}
                    className="bg-white rounded-xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all group relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${colors.iconColor}`} />
                      </div>
                      {item.documents && item.documents.length > 0 && (
                        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-semibold">
                          {item.documents.length} Dok
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-4">{item.name}</h3>
                    {hasData ? (
                      <div className="space-y-2 text-sm">
                        {item.location && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Plassering</span>
                            <span className="font-medium">{item.location}</span>
                          </div>
                        )}
                        {item.system_type && (
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Type</span>
                            <span className="font-medium">{item.system_type}</span>
                          </div>
                        )}
                        {item.last_checked && (
                          <div className="flex justify-between py-2">
                            <span className="text-gray-600">Sist kontrollert</span>
                            <span className="font-medium">{item.last_checked}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400 text-sm">Ingen informasjon lagt til</p>
                        <p className="text-blue-600 text-xs mt-2">Klikk for å legge til</p>
                      </div>
                    )}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-blue-600 text-sm font-semibold">
                        {hasData ? 'Se detaljer' : 'Legg til info'} →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Access & Locks Tab */}
        {activeTab === 'access' && propertyData && (
          <AccessAndLocksTab ownerId={propertyData.id} />
        )}

        {/* Floor Plan Tab */}
        {activeTab === 'floor-plan' && propertyData && (
          <FloorPlanTab ownerId={propertyData.id} />
        )}

        {/* Furniture & Equipment Tab */}
        {activeTab === 'furniture' && propertyData && (
          <FurnitureEquipmentTab ownerId={propertyData.id} />
        )}

        {/* Electronics & Appliances Tab */}
        {activeTab === 'electronics' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Elektronikk & Hvitevarer</h3>
                <p className="text-gray-600 mb-4">Denne seksjonen er under utvikling</p>
                <p className="text-sm text-gray-500">Her vil du kunne administrere elektroniske enheter og hvitevarer</p>
              </div>
            </div>
          </div>
        )}

        {/* Furniture & Equipment Tab */}
        {activeTab === 'furniture' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/>
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Møbler & Utstyr</h3>
                <p className="text-gray-600 mb-4">Denne seksjonen er under utvikling</p>
                <p className="text-sm text-gray-500">Her vil du kunne administrere inventar og utstyr i eiendommen</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions & Manuals Tab */}
        {activeTab === 'instructions' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instruksjoner & Manualer</h3>
                <p className="text-gray-600 mb-4">Denne seksjonen er under utvikling</p>
                <p className="text-sm text-gray-500">Her vil du kunne finne brukermanualer og instruksjoner</p>
              </div>
            </div>
          </div>
        )}

        {/* 3D Map Tab */}
        {activeTab === '3d-map' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3D Romkart</h3>
                <p className="text-gray-600 mb-4">Denne seksjonen er under utvikling</p>
                <p className="text-sm text-gray-500">Her vil du kunne utforske et interaktivt 3D-kart over eiendommen</p>
              </div>
            </div>
          </div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Objektdatabase</h3>
                <p className="text-gray-600 mb-4">Denne seksjonen er under utvikling</p>
                <p className="text-sm text-gray-500">Her vil du kunne søke i en database over alle objekter</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* System Detail Modal */}
      {showModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gray-50 px-6 py-5 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
              <div className="flex items-center gap-2">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Rediger
                  </button>
                ) : (
                  <button
                    onClick={handleSaveSystem}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Lagre
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Video Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  1. Video av plassering
                </h3>
                {selectedItem.video_url ? (
                  <div className="bg-black rounded-lg overflow-hidden aspect-video">
                    <video src={`${BACKEND_URL}${selectedItem.video_url}`} controls className="w-full h-full" />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Last opp video</p>
                    <p className="text-gray-400 text-xs mt-1">Kommende funksjon</p>
                  </div>
                )}
              </div>

              {/* Images Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  2. Bilder av enheten
                </h3>
                {selectedItem.images && selectedItem.images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {selectedItem.images.map((img) => (
                      <div
                        key={img.id}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                      >
                        <img
                          src={`${BACKEND_URL}${img.url}`}
                          alt={img.caption || 'Bilde'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Last opp bilder</p>
                    <p className="text-gray-400 text-xs mt-1">Kommende funksjon</p>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  3. & 4. Type og Informasjon
                </h3>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Plassering</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editData.location}
                          onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                          placeholder="F.eks. Gang, 1. etg"
                        />
                      ) : (
                        <span className="font-semibold">{selectedItem.location || 'Ikke angitt'}</span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Systemtype / Modell</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editData.system_type}
                          onChange={(e) => setEditData(prev => ({ ...prev, system_type: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                          placeholder="F.eks. Eaton xComfort"
                        />
                      ) : (
                        <span className="font-semibold">{selectedItem.system_type || 'Ikke angitt'}</span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Installatør</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editData.installer}
                          onChange={(e) => setEditData(prev => ({ ...prev, installer: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                          placeholder="F.eks. Oslo Elektro AS"
                        />
                      ) : (
                        <span className="font-semibold">{selectedItem.installer || 'Ikke angitt'}</span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Siste kontroll</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={editData.last_checked}
                          onChange={(e) => setEditData(prev => ({ ...prev, last_checked: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                          placeholder="F.eks. Okt 2024"
                        />
                      ) : (
                        <span className="font-semibold">{selectedItem.last_checked || 'Ikke angitt'}</span>
                      )}
                    </div>
                    {editMode && (
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Installert dato</label>
                        <input
                          type="text"
                          value={editData.installed_date}
                          onChange={(e) => setEditData(prev => ({ ...prev, installed_date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                          placeholder="F.eks. 2021"
                        />
                      </div>
                    )}
                  </div>
                  <hr className="border-gray-300 my-4" />
                  <div>
                    <label className="text-xs text-gray-600 block mb-2">Beskrivelse / Notater</label>
                    {editMode ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        rows="4"
                        placeholder="Beskriv plasseringen, spesielle detaljer, instruksjoner etc."
                      />
                    ) : (
                      <p className="text-sm leading-relaxed">{selectedItem.description || 'Ingen beskrivelse'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  5. Dokumentasjon
                </h3>
                {selectedItem.documents && selectedItem.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedItem.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={`${BACKEND_URL}${doc.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors"
                      >
                        <File className="w-5 h-5 text-red-600" />
                        <span className="flex-1">{doc.filename}</span>
                        <Download className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                    <File className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Last opp dokumenter</p>
                    <p className="text-gray-400 text-xs mt-1">Kommende funksjon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDocumentation;