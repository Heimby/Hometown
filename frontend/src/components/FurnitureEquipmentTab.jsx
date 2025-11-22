import React, { useState, useEffect } from 'react';
import { Info, MessageSquare, Plus, CheckCircle2, Save } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FurnitureEquipmentTab = ({ ownerId }) => {
  const [furnitureData, setFurnitureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generalComments, setGeneralComments] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ownerId) {
      fetchFurnitureData();
    }
  }, [ownerId]);

  const fetchFurnitureData = async () => {
    try {
      const response = await axios.get(`${API}/owners/${ownerId}/furniture-equipment`);
      setFurnitureData(response.data);
      setGeneralComments(response.data.general_comments || '');
    } catch (error) {
      console.error('Failed to fetch furniture data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (itemId) => {
    try {
      const item = furnitureData.items.find(i => i.id === itemId);
      const newCheckedState = !item.checked;

      await axios.put(`${API}/owners/${ownerId}/furniture-equipment/items/${itemId}`, {
        checked: newCheckedState
      });

      // Update local state
      setFurnitureData(prev => ({
        ...prev,
        items: prev.items.map(i => 
          i.id === itemId ? { ...i, checked: newCheckedState } : i
        )
      }));
    } catch (error) {
      console.error('Failed to update checkbox:', error);
    }
  };

  const handleSaveComments = async () => {
    setIsSaving(true);
    try {
      await axios.put(`${API}/owners/${ownerId}/furniture-equipment`, {
        general_comments: generalComments
      });
      alert('Kommentarer lagret!');
    } catch (error) {
      console.error('Failed to save comments:', error);
      alert('Kunne ikke lagre kommentarer. Prøv igjen.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmChecklist = async () => {
    try {
      await axios.put(`${API}/owners/${ownerId}/furniture-equipment`, {
        last_confirmed: new Date().toISOString(),
        confirmed_by: ownerId
      });
      await fetchFurnitureData();
      alert('Sjekkliste bekreftet!');
    } catch (error) {
      console.error('Failed to confirm checklist:', error);
      alert('Kunne ikke bekrefte sjekkliste. Prøv igjen.');
    }
  };

  const handleAddItem = async () => {
    const name = prompt('Navn på inventar:');
    if (!name) return;
    
    const quantity = prompt('Antall:');
    if (!quantity) return;
    
    const comment = prompt('Kommentar (valgfri):') || '';

    try {
      await axios.post(`${API}/owners/${ownerId}/furniture-equipment/items`, {
        name,
        quantity,
        comment,
        category: 'other'
      });
      await fetchFurnitureData();
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Kunne ikke legge til item. Prøv igjen.');
    }
  };

  const calculateProgress = () => {
    if (!furnitureData || !furnitureData.items) return { total: 0, checked: 0, percentage: 0 };
    
    const total = furnitureData.items.length;
    const checked = furnitureData.items.filter(item => item.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    return { total, checked, percentage, remaining: total - checked };
  };

  const getItemsByCategory = (category) => {
    if (!furnitureData) return [];
    return furnitureData.items.filter(item => item.category === category);
  };

  const getCategoryTitle = (category) => {
    const titles = {
      kitchen: '🍳 Kjøkkenutstyr',
      tableware: '🍽️ Servise & Glass',
      household: '🧹 Husholdning & Rengjøring',
      other: '📦 Annet'
    };
    return titles[category] || category;
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      kitchen: 'Essensielt utstyr for matlaging og servering',
      tableware: 'Tallerkener, glass og bestikk (basert på maks antall gjester)',
      household: 'Nødvendig utstyr for renhold og vaskehjelp',
      other: 'Tilpassede elementer lagt til manuelt'
    };
    return descriptions[category] || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div>
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-8">
        <button
          onClick={handleConfirmChecklist}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <CheckCircle2 className="w-5 h-5" />
          Bekreft Sjekkliste
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-4">
        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">📋 Obligatorisk Sjekkliste</h3>
          <p className="text-sm text-blue-800">
            Alle elementer i denne listen må være tilstede og i funksjonell stand før boligen kan leies ut. 
            Huk av for hvert element når det er bekreftet tilgjengelig og i god stand.
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Fremdrift sjekkliste</h3>
          <span className="text-3xl font-bold text-green-600">{progress.percentage}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="flex gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              <strong className="text-gray-900">{progress.checked}</strong> av{' '}
              <strong className="text-gray-900">{progress.total}</strong> bekreftet
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>
              <strong className="text-gray-900">{progress.remaining}</strong> gjenstår
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Generelle kommentarer og avvik
          </h3>
          <button
            onClick={handleSaveComments}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Lagrer...' : 'Lagre'}
          </button>
        </div>
        <div className="relative">
          <textarea
            value={generalComments}
            onChange={(e) => setGeneralComments(e.target.value)}
            className="w-full min-h-[120px] px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Legg til generelle kommentarer om boligens tilstand, avvik fra sjekklisten, eller andre relevante merknader..."
            maxLength={2000}
          />
          <span className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2">
            {generalComments.length}/2000
          </span>
        </div>
      </div>

      {/* Add Item Section */}
      <div
        onClick={handleAddItem}
        className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 mb-8 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-all"
      >
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Legg til nytt inventar
        </h3>
        <p className="text-sm text-gray-600">
          Klikk her for å legge til ekstra møbler eller utstyr som ikke er på listen
        </p>
      </div>

      {/* Checklist Sections */}
      {['kitchen', 'tableware', 'household', 'other'].map(category => {
        const items = getItemsByCategory(category);
        if (items.length === 0 && category === 'other') return null;
        
        return (
          <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {getCategoryTitle(category)}
              </h2>
              <p className="text-sm text-gray-600">{getCategoryDescription(category)}</p>
            </div>
            
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="w-16 px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    ✓
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Inventar
                  </th>
                  <th className="w-48 px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Antall
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Kommentar
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index === items.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-5 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="w-5 h-5 cursor-pointer accent-green-600"
                      />
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.comment || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Last Confirmed Info */}
      {furnitureData?.last_confirmed && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          <strong>✓ Sjekkliste sist bekreftet:</strong>{' '}
          {new Date(furnitureData.last_confirmed).toLocaleString('no-NO')}
        </div>
      )}
    </div>
  );
};

export default FurnitureEquipmentTab;
