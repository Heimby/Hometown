import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Home, TrendingUp, Mail, Phone, MapPin, Calendar, ArrowLeft, Search, Filter, X } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' or 'owners'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalOwners: 0,
    todayLeads: 0,
    todayOwners: 0,
  });

  const handleStatusChange = async (ownerId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/owners/${ownerId}/status`, { status: newStatus });
      // Update local state
      setOwners(owners.map(owner => 
        owner.id === ownerId ? { ...owner, status: newStatus } : owner
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Kunne ikke oppdatere status');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsRes, ownersRes] = await Promise.all([
        axios.get(`${API}/leads`),
        axios.get(`${API}/owner-portal/all`)
      ]);

      const leadsData = leadsRes.data || [];
      const ownersData = ownersRes.data || [];

      setLeads(leadsData);
      setOwners(ownersData);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayLeads = leadsData.filter(l => l.created_at?.startsWith(today)).length;
      const todayOwners = ownersData.filter(o => o.created_at?.startsWith(today)).length;

      setStats({
        totalLeads: leadsData.length,
        totalOwners: ownersData.length,
        todayLeads,
        todayOwners,
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOwners = owners.filter(owner =>
    owner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <img 
                src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/ke4s6nwo_4633C819.svg" 
                alt="DigiHome Logo" 
                className="h-8"
              />
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium border border-purple-200">
                Admin Dashboard
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Leads</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
            <p className="text-xs text-gray-500 mt-2">+{stats.todayLeads} i dag</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Home className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Eierportaler</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOwners}</p>
            <p className="text-xs text-gray-500 mt-2">+{stats.todayOwners} i dag</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Konverteringsrate</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalLeads > 0 ? Math.round((stats.totalOwners / stats.totalLeads) * 100) : 0}%
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">I dag</p>
            <p className="text-3xl font-bold text-gray-900">{stats.todayLeads + stats.todayOwners}</p>
            <p className="text-xs text-gray-500 mt-2">Nye registreringer</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('leads')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'leads'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Leads ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('owners')}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === 'owners'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Eierportaler ({owners.length})
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Søk etter navn, e-post eller adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p>Laster data...</p>
              </div>
            ) : activeTab === 'leads' ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Navn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontakt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        Ingen leads funnet
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center gap-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {lead.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {lead.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-start gap-1">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{lead.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {lead.status || 'new'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Navn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontakt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onboarding</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOwners.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        Ingen eierportaler funnet
                      </td>
                    </tr>
                  ) : (
                    filteredOwners.map((owner) => (
                      <tr 
                        key={owner.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedOwner(owner)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Home className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center gap-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {owner.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {owner.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-start gap-1">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{owner.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusDropdown owner={owner} onStatusChange={(newStatus) => handleStatusChange(owner.id, newStatus)} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {owner.onboarding_completed ? (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                ✓ Fullført
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOwner(owner);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                              >
                                Se detaljer →
                              </button>
                            </div>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                              Venter
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Owner Details Modal */}
      {selectedOwner && (
        <OwnerDetailsModal 
          owner={selectedOwner} 
          onClose={() => setSelectedOwner(null)} 
        />
      )}
    </div>
  );
};

// Owner Details Modal Component
const OwnerDetailsModal = ({ owner, onClose }) => {
  const data = owner.onboarding_data;

  if (!data) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Eierdetaljer</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-500">Ingen onboarding-data tilgjengelig ennå.</p>
        </div>
      </div>
    );
  }

  const getRoomCount = (roomType) => {
    return data.rooms?.[roomType]?.length || 0;
  };

  const getTotalBeds = () => {
    const bedrooms = data.rooms?.bedroom || [];
    let total = 0;
    bedrooms.forEach(room => {
      if (room.furniture) {
        room.furniture.forEach(f => {
          if (f.type === 'bed') total++;
        });
      }
    });
    return total;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{owner.name}</h2>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {owner.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {owner.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {data.address}, {data.city}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Property Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-600" />
              Eiendomsinformasjon
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="text-sm text-gray-500">Boligtype</span>
                <p className="font-medium capitalize">{data.property_type === 'apartment' ? 'Leilighet' : 'Hus/Rekkehus'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Eierform</span>
                <p className="font-medium capitalize">{data.ownership_type}</p>
              </div>
              {data.unit && (
                <div>
                  <span className="text-sm text-gray-500">Bolignummer</span>
                  <p className="font-medium">{data.unit}</p>
                </div>
              )}
            </div>
          </div>

          {/* Rental Strategy */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Utleiestrategi</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="text-sm text-gray-500">Strategi</span>
                <p className="font-medium capitalize">
                  {data.rental_strategy === 'airbnb' ? 'Airbnb' : 
                   data.rental_strategy === 'long' ? 'Langtidsutleie' : 
                   'Dynamisk Utleie'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Startdato</span>
                <p className="font-medium">{data.start_date}</p>
              </div>
              {data.end_date && (
                <div>
                  <span className="text-sm text-gray-500">Sluttdato</span>
                  <p className="font-medium">{data.end_date}</p>
                </div>
              )}
            </div>
          </div>

          {/* Rooms Summary */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Rom og møblering</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{getRoomCount('living')}</div>
                <div className="text-sm text-gray-600">Stuer</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{getRoomCount('bedroom')}</div>
                <div className="text-sm text-gray-600">Soverom</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{getRoomCount('bathroom')}</div>
                <div className="text-sm text-gray-600">Bad</div>
              </div>
            </div>

            {/* Detailed Rooms */}
            <div className="mt-4 space-y-3">
              {data.rooms?.living?.map((room, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3">
                  <div className="font-medium mb-2">Stue {idx + 1}</div>
                  {room.furniture && room.furniture.length > 0 && (
                    <div className="text-sm text-gray-600 space-y-1">
                      {room.furniture.map((f, i) => (
                        <div key={i}>
                          • {f.type === 'sofa' ? 'Sofa' : f.type === 'sofabed' ? 'Sovesofa' : f.type === 'dining' ? 'Spisebord' : f.type}
                          {f.details.seats && ` (${f.details.seats} plasser)`}
                          {f.details.width && ` (${f.details.width}cm)`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {data.rooms?.bedroom?.map((room, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3">
                  <div className="font-medium mb-2">Soverom {idx + 1}</div>
                  {room.furniture && room.furniture.length > 0 && (
                    <div className="text-sm text-gray-600 space-y-1">
                      {room.furniture.map((f, i) => (
                        <div key={i}>
                          • Seng ({f.details.width}cm)
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {data.rooms?.bathroom?.map((room, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3">
                  <div className="font-medium mb-2">Bad {idx + 1}</div>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {room.amenities.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Fasiliteter</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-3">
                {data.facilities && data.facilities.length > 0 ? (
                  data.facilities.map((f, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Ingen ekstra fasiliteter</span>
                )}
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Parkering: </span>
                <span className="font-medium">
                  {data.parking === 'none' ? 'Ingen' : 
                   data.parking === 'free' ? 'Gratis' : 
                   'Garasje'}
                </span>
              </div>
            </div>
          </div>

          {/* Photography & Cleaning */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Tjenester</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Fotografering</div>
                <div className="font-medium">
                  {data.photography === 'professional' ? 'Bestill Fotograf (2 500 kr)' : 'Last opp selv (Gratis)'}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Utvask</div>
                <div className="font-medium">
                  {data.cleaning === 'self' ? 'Jeg vasker selv (Gratis)' : 'Bestill nedvask (3 500 kr)'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
