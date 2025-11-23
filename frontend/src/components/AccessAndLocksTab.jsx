import React, { useState, useEffect } from 'react';
import { Lock, Key, Shield, MapPin, Home, Car, Edit2, Save, X, Upload, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AccessAndLocksTab = ({ ownerId }) => {
  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (ownerId) {
      fetchAccessData();
    }
  }, [ownerId]);

  const fetchAccessData = async () => {
    try {
      const response = await axios.get(`${API}/owners/${ownerId}/access-locks`);
      setAccessData(response.data);
    } catch (error) {
      console.error('Failed to fetch access data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 'primary_access',
      title: 'Primær Innlåsingsmetode',
      icon: Lock,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      badge: accessData?.primary_access?.video?.url ? 'Video' : null,
      getData: () => accessData?.primary_access || {},
      getPreview: (data) => [
        { label: 'Type', value: data.system_type || 'Ikke angitt' },
        { label: 'Metode', value: data.access_method || 'Ikke angitt' },
        { label: 'Plassering', value: data.location || 'Ikke angitt' },
        { label: 'Status', value: data.system_type ? '✅ Aktiv' : 'Ikke konfigurert' }
      ]
    },
    {
      id: 'backup_access',
      title: 'Reserve Innlåsingsmetode',
      icon: Key,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      badge: 'Instruksjon',
      getData: () => accessData?.backup_access || {},
      getPreview: (data) => [
        { label: 'Type', value: data.key_type || 'Ikke angitt' },
        { label: 'Plassering nøkkel', value: data.key_location || 'Ikke angitt' },
        { label: 'Kontaktperson', value: data.contact_person || 'Ikke angitt' },
        { label: 'Tilgjengelig', value: data.availability || 'Ikke angitt' }
      ]
    },
    {
      id: 'emergency_protocol',
      title: 'Nødprotokoll',
      icon: Shield,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badge: 'Nødprotokoll',
      getData: () => accessData?.emergency_protocol || {},
      getPreview: (data) => [
        { label: 'Primær kontakt', value: data.primary_contact?.name || 'Ikke angitt' },
        { label: 'Sekundær kontakt', value: data.secondary_contact?.name || 'Ikke angitt' },
        { label: 'Låsesmed', value: data.locksmith_contact?.name || 'Ikke angitt' },
        { label: 'Responstid', value: data.locksmith_contact?.response_time || 'Ikke angitt' }
      ]
    },
    {
      id: 'navigation_from_street',
      title: 'Navigasjon fra Gaten',
      icon: MapPin,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      badge: accessData?.navigation_from_street?.video?.url ? 'Video Guide' : null,
      getData: () => accessData?.navigation_from_street || {},
      getPreview: (data) => [
        { label: 'Startpunkt', value: data.start_point || 'Ikke angitt' },
        { label: 'Innhold', value: data.description ? 'Komplett rute' : 'Ikke angitt' },
        { label: 'Portkode', value: data.door_code || 'Ikke angitt' },
        { label: 'Postkasse', value: data.mailbox_number || 'Ikke angitt' }
      ]
    },
    {
      id: 'room_walkthrough',
      title: 'Gjennomgang av Rom',
      icon: Home,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      badge: accessData?.room_walkthrough?.video?.url ? 'Video Guide' : null,
      getData: () => accessData?.room_walkthrough || {},
      getPreview: (data) => [
        { label: 'Rom dokumentert', value: data.rooms_documented || 'Ikke angitt' },
        { label: 'Innhold', value: data.description ? 'Layout, innredning, funksjoner' : 'Ikke angitt' },
        { label: 'Format', value: data.description ? 'Første-person walkthrough' : 'Ikke angitt' }
      ]
    },
    {
      id: 'parking_info',
      title: 'Parkeringsmuligheter',
      icon: Car,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badge: accessData?.parking_info?.video?.url ? 'Video Guide' : null,
      getData: () => accessData?.parking_info || {},
      getPreview: (data) => [
        { label: 'Garasjeplass', value: data.garage_spot || 'Ikke angitt' },
        { label: 'Gateparkering', value: data.street_parking || 'Ikke angitt' },
        { label: 'Garasjekode', value: data.garage_code || 'Ikke angitt' }
      ]
    }
  ];

  const openCategoryModal = (category) => {
    setSelectedCategory(category);
    setEditData(category.getData());
    setEditMode(false);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setEditMode(false);
    setEditData({});
  };

  const handleSave = async () => {
    try {
      const endpoint = `${API}/owners/${ownerId}/access-locks/${selectedCategory.id.replace('_', '-')}`;
      await axios.put(endpoint, editData);
      await fetchAccessData();
      setEditMode(false);
      alert('Informasjonen ble lagret!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Kunne ikke lagre. Prøv igjen.');
    }
  };

  const renderEditForm = () => {
    switch (selectedCategory?.id) {
      case 'primary_access':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Systemtype</label>
                <input
                  type="text"
                  value={editData.system_type || ''}
                  onChange={(e) => setEditData({ ...editData, system_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. Yale Doorman V2N"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Adgangsmetode</label>
                <input
                  type="text"
                  value={editData.access_method || ''}
                  onChange={(e) => setEditData({ ...editData, access_method: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. PIN-kode"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Plassering</label>
                <input
                  type="text"
                  value={editData.location || ''}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. Hovedinngangsdør"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">PIN-kode</label>
                <input
                  type="text"
                  value={editData.pin_code || ''}
                  onChange={(e) => setEditData({ ...editData, pin_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. 1234#"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Beskrivelse</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="3"
                placeholder="Beskriv låsesystemet..."
              />
            </div>
          </div>
        );

      case 'backup_access':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Type</label>
                <input
                  type="text"
                  value={editData.key_type || ''}
                  onChange={(e) => setEditData({ ...editData, key_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. Fysisk nøkkel"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Plassering</label>
                <input
                  type="text"
                  value={editData.key_location || ''}
                  onChange={(e) => setEditData({ ...editData, key_location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. Safe hos nabo"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Kontaktperson</label>
                <input
                  type="text"
                  value={editData.contact_person || ''}
                  onChange={(e) => setEditData({ ...editData, contact_person: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. Anne Hansen"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Telefon</label>
                <input
                  type="text"
                  value={editData.contact_phone || ''}
                  onChange={(e) => setEditData({ ...editData, contact_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. 987 65 432"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Beskrivelse</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="3"
                placeholder="Beskriv reserve løsning..."
              />
            </div>
          </div>
        );

      case 'emergency_protocol':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-sm mb-3">Primær Kontakt</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Navn</label>
                  <input
                    type="text"
                    value={editData.primary_contact?.name || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      primary_contact: { ...editData.primary_contact, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Telefon</label>
                  <input
                    type="text"
                    value={editData.primary_contact?.phone || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      primary_contact: { ...editData.primary_contact, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Låsesmed 24/7</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Navn</label>
                  <input
                    type="text"
                    value={editData.locksmith_contact?.name || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      locksmith_contact: { ...editData.locksmith_contact, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Telefon</label>
                  <input
                    type="text"
                    value={editData.locksmith_contact?.phone || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      locksmith_contact: { ...editData.locksmith_contact, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'navigation_from_street':
      case 'room_walkthrough':
        return (
          <div className="space-y-4">
            {selectedCategory.id === 'navigation_from_street' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Startpunkt</label>
                  <input
                    type="text"
                    value={editData.start_point || ''}
                    onChange={(e) => setEditData({ ...editData, start_point: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Portkode</label>
                  <input
                    type="text"
                    value={editData.door_code || ''}
                    onChange={(e) => setEditData({ ...editData, door_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}
            {selectedCategory.id === 'room_walkthrough' && (
              <div>
                <label className="text-xs text-gray-600 block mb-1">Rom dokumentert</label>
                <input
                  type="text"
                  value={editData.rooms_documented || ''}
                  onChange={(e) => setEditData({ ...editData, rooms_documented: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. 7 rom (komplett)"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-gray-600 block mb-1">Beskrivelse</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="3"
              />
            </div>
          </div>
        );

      case 'parking_info':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Garasjeplass</label>
                <input
                  type="text"
                  value={editData.garage_spot || ''}
                  onChange={(e) => setEditData({ ...editData, garage_spot: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. P-kjeller, plass #24"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Garasjekode</label>
                <input
                  type="text"
                  value={editData.garage_code || ''}
                  onChange={(e) => setEditData({ ...editData, garage_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="F.eks. 4321#"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Beskrivelse</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="3"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Alert Box */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-8 flex gap-4">
        <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-orange-900 mb-1">⚠️ Anbefaling</h3>
          <p className="text-sm text-orange-800">
            Denne dokumentasjonen bør gjennomgås etter at andre deler av den digitale tvillingen er dokumentert.
          </p>
        </div>
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const data = category.getData();
          const preview = category.getPreview(data);
          const hasData = Object.values(data).some(val =>
            val && (typeof val === 'string' ? val !== '' : true)
          );

          return (
            <div
              key={category.id}
              onClick={() => openCategoryModal(category)}
              className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-500 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Icon Section */}
                <div className={`w-12 h-12 ${category.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-6 h-6 ${category.iconColor}`} />
                </div>

                {/* Main Content Section */}
                <div className="flex-1 min-w-0">
                  {/* Title & Badge Row */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{category.title}</h3>
                    {category.badge && (
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded font-semibold border border-blue-100">
                        {category.badge}
                      </span>
                    )}
                  </div>

                  {/* Data Grid (4 Columns) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                    {preview.map((item, idx) => (
                      <div key={idx} className="min-w-0">
                        <span className="text-gray-500 text-xs block">{item.label}</span>
                        <span className="font-medium truncate block">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button Section */}
                <div className="flex-shrink-0 mt-2 md:mt-0">
                  <span className="text-blue-600 text-sm font-semibold group-hover:underline flex items-center gap-1">
                    {hasData ? 'Se detaljer' : 'Legg til info'}
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

      {/* Modal */}
      {selectedCategory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <selectedCategory.icon className={`w-6 h-6 ${selectedCategory.iconColor}`} />
                {selectedCategory.title}
              </h2>
              <div className="flex items-center gap-2">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Rediger
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Lagre
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Video Section (if applicable) */}
              {['primary_access', 'navigation_from_street', 'room_walkthrough', 'parking_info'].includes(selectedCategory.id) && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Video
                  </h3>
                  <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Last opp video</p>
                    <p className="text-gray-400 text-xs mt-1">Kommende funksjon</p>
                  </div>
                </div>
              )}

              {/* Edit Form */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Informasjon
                </h3>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  {editMode ? renderEditForm() : (
                    <div className="space-y-3 text-sm">
                      {selectedCategory.getPreview(editData).map((item, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-semibold text-right">{item.value}</span>
                        </div>
                      ))}
                      {editData.description && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Beskrivelse</p>
                          <p className="text-sm">{editData.description}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessAndLocksTab;
