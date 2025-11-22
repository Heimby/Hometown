import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Download, Plus, X, Upload, File, 
  Image as ImageIcon, Trash2, Activity
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PropertyDocumentation = () => {
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [securitySystems, setSecuritySystems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProperty = localStorage.getItem('ownerProperty');
    if (savedProperty) {
      const data = JSON.parse(savedProperty);
      setPropertyData(data);
      fetchSecuritySystems(data.id);
    }
  }, []);

  const fetchSecuritySystems = async (ownerId) => {
    try {
      const response = await axios.get(`${API}/owners/${ownerId}/documentation/security-systems`);
      setSecuritySystems(response.data);
    } catch (error) {
      console.error('Failed to fetch security systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/owner-portal');
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const getCategoryIcon = (category) => {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">DigiHome</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {propertyData?.address || 'Laster adresse...'}
          </p>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Oversikt
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'security'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-5 h-5" />
                Sikkerhet og Systemer
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Tilbake til eiendommer
            </button>
            <h1 className="text-4xl font-bold text-gray-900">
              {activeTab === 'overview' ? 'Oversikt' : 'Sikkerhet og Systemer'}
            </h1>
            <p className="text-gray-600 mt-2">
              {activeTab === 'overview' 
                ? 'Generell informasjon om eiendommen'
                : 'Klikk på et system for å se video, bilder og dokumentasjon'
              }
            </p>
          </div>
          {activeTab === 'security' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Legg til system
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === 'overview' && propertyData && (
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Onboarding-informasjon</h2>
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
            {propertyData.onboarding_completed && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✓ Onboarding fullført
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-4">Laster...</p>
              </div>
            ) : securitySystems.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Ingen sikkerhetssystemer lagt til ennå</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Legg til ditt første system
                </button>
              </div>
            ) : (
              securitySystems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openItemModal(item)}
                  className="bg-white rounded-xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all group relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      {getCategoryIcon(item.category)}
                    </div>
                    {item.documents && item.documents.length > 0 && (
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-semibold">
                        {item.documents.length} Dok
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-4">{item.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Plassering</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium">{item.system_type}</span>
                    </div>
                    {item.last_checked && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Sist kontrollert</span>
                        <span className="font-medium">{item.last_checked}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-blue-600 text-sm font-semibold">Se detaljer →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
      {showModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="sticky top-0 bg-gray-50 px-6 py-5 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Video Section */}
              {selectedItem.video_url && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    1. Video av plassering
                  </h3>
                  <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                    <video src={selectedItem.video_url} controls className="w-full h-full" />
                  </div>
                </div>
              )}

              {/* Images Section */}
              {selectedItem.images && selectedItem.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    2. Bilder av enheten
                  </h3>
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
                </div>
              )}

              {/* Info Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  3. & 4. Type og Informasjon
                </h3>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-xs text-gray-600 block mb-1">Systemtype / Modell</span>
                      <span className="font-semibold">{selectedItem.system_type}</span>
                    </div>
                    {selectedItem.installer && (
                      <div>
                        <span className="text-xs text-gray-600 block mb-1">Installatør</span>
                        <span className="font-semibold">{selectedItem.installer}</span>
                      </div>
                    )}
                    {selectedItem.last_checked && (
                      <div>
                        <span className="text-xs text-gray-600 block mb-1">Siste kontroll</span>
                        <span className="font-semibold">{selectedItem.last_checked}</span>
                      </div>
                    )}
                    {selectedItem.installed_date && (
                      <div>
                        <span className="text-xs text-gray-600 block mb-1">Installert</span>
                        <span className="font-semibold">{selectedItem.installed_date}</span>
                      </div>
                    )}
                  </div>
                  {selectedItem.description && (
                    <>
                      <hr className="border-gray-300 my-4" />
                      <div>
                        <span className="text-xs text-gray-600 block mb-2">Beskrivelse / Notater</span>
                        <p className="text-sm leading-relaxed">{selectedItem.description}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Documents Section */}
              {selectedItem.documents && selectedItem.documents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    5. Dokumentasjon
                  </h3>
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New System Modal - Placeholder */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Legg til nytt sikkerhetssystem</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Funksjonalitet for å legge til nye systemer kommer snart. Dette vil inkludere muligheten til å laste opp bilder, videoer og dokumenter.
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDocumentation;
