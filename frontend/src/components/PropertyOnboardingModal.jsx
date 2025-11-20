import React, { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PropertyOnboardingModal = ({ isOpen, onClose, propertyData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initializedRef = useRef(false);

  // Form state for all steps
  const [formData, setFormData] = useState({
    // Step 1
    address: '',
    city: '',
    unit: '',
    propertyType: 'apartment',
    ownershipType: 'selveier',
    
    // Step 2
    rentalStrategy: 'dynamic',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    
    // Step 3
    livingRooms: [],
    bedrooms: [],
    bathrooms: [],
    
    // Step 4
    facilities: [],
    parking: 'none',
    
    // Step 5
    photography: 'professional',
    cleaning: 'self'
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && propertyData) {
      setFormData(prev => ({
        ...prev,
        address: propertyData.property_address || propertyData.address || '',
        city: 'Bergen'
      }));
      
      // Initialize default rooms only once
      if (!initializedRef.current) {
        setFormData(prev => ({
          ...prev,
          livingRooms: [{ id: Date.now(), type: 'living', furniture: [] }],
          bedrooms: [{ id: Date.now() + 1, type: 'bedroom', furniture: [] }],
          bathrooms: [{ id: Date.now() + 2, type: 'bathroom', amenities: ['dusj', 'toalett'] }]
        }));
        initializedRef.current = true;
      }
    }
  }, [isOpen, propertyData]);

  // Reset modal when closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      initializedRef.current = false;
      setFormData({
        address: '',
        city: '',
        unit: '',
        propertyType: 'apartment',
        ownershipType: 'selveier',
        rentalStrategy: 'dynamic',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        livingRooms: [],
        bedrooms: [],
        bathrooms: [],
        facilities: [],
        parking: 'none',
        photography: 'professional',
        cleaning: 'self'
      });
    }
  }, [isOpen]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const ownerId = propertyData?.id || propertyData?.ownerId;
      
      if (!ownerId) {
        console.error('No owner ID found in propertyData:', propertyData);
        alert('Ingen eier-ID funnet. Vennligst prøv å laste siden på nytt.');
        setIsSubmitting(false);
        return;
      }
      
      const onboardingData = {
        address: formData.address,
        city: formData.city,
        unit: formData.unit || null,
        property_type: formData.propertyType,
        ownership_type: formData.ownershipType,
        rental_strategy: formData.rentalStrategy,
        start_date: formData.startDate,
        end_date: formData.endDate || null,
        rooms: {
          living: formData.livingRooms,
          bedroom: formData.bedrooms,
          bathroom: formData.bathrooms
        },
        facilities: formData.facilities,
        parking: formData.parking,
        photography: formData.photography,
        cleaning: formData.cleaning
      };

      console.log('Submitting onboarding data for owner:', ownerId);
      console.log('Data:', onboardingData);

      const response = await axios.put(`${API_URL}/api/owners/${ownerId}/onboarding`, onboardingData);
      
      console.log('Onboarding saved successfully:', response.data);
      
      // Mark onboarding as completed in localStorage
      localStorage.setItem('completedOnboarding', 'true');
      
      onClose();
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      console.error('Error response:', error.response?.data);
      alert(`Det oppsto en feil ved lagring av data: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Room management functions for Step 3
  const addRoom = (type) => {
    const roomKey = type === 'living' ? 'livingRooms' : type === 'bedroom' ? 'bedrooms' : 'bathrooms';
    const newRoom = {
      id: Date.now() + Math.random(), // Ensure unique ID
      type,
      furniture: type !== 'bathroom' ? [] : null,
      amenities: type === 'bathroom' ? ['dusj', 'toalett'] : null
    };
    
    setFormData(prev => ({
      ...prev,
      [roomKey]: [...prev[roomKey], newRoom]
    }));
  };

  const removeRoom = (type, roomId) => {
    const roomKey = type === 'living' ? 'livingRooms' : type === 'bedroom' ? 'bedrooms' : 'bathrooms';
    setFormData(prev => ({
      ...prev,
      [roomKey]: prev[roomKey].filter(room => room.id !== roomId)
    }));
  };

  const addFurniture = (type, roomId, furnitureType) => {
    const roomKey = type === 'living' ? 'livingRooms' : 'bedrooms';
    setFormData(prev => ({
      ...prev,
      [roomKey]: prev[roomKey].map(room => {
        if (room.id === roomId) {
          const newFurniture = {
            id: Date.now() + Math.random(),
            type: furnitureType,
            details: getFurnitureDefaults(furnitureType)
          };
          return {
            ...room,
            furniture: [...room.furniture, newFurniture]
          };
        }
        return room;
      })
    }));
  };

  const removeFurniture = (type, roomId, furnitureId) => {
    const roomKey = type === 'living' ? 'livingRooms' : 'bedrooms';
    setFormData(prev => ({
      ...prev,
      [roomKey]: prev[roomKey].map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            furniture: room.furniture.filter(f => f.id !== furnitureId)
          };
        }
        return room;
      })
    }));
  };

  const updateFurniture = (type, roomId, furnitureId, field, value) => {
    const roomKey = type === 'living' ? 'livingRooms' : 'bedrooms';
    setFormData(prev => ({
      ...prev,
      [roomKey]: prev[roomKey].map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            furniture: room.furniture.map(f => {
              if (f.id === furnitureId) {
                return {
                  ...f,
                  details: { ...f.details, [field]: value }
                };
              }
              return f;
            })
          };
        }
        return room;
      })
    }));
  };

  const toggleAmenity = (roomId, amenity) => {
    setFormData(prev => ({
      ...prev,
      bathrooms: prev.bathrooms.map(room => {
        if (room.id === roomId) {
          const amenities = room.amenities || [];
          const hasAmenity = amenities.includes(amenity);
          return {
            ...room,
            amenities: hasAmenity 
              ? amenities.filter(a => a !== amenity)
              : [...amenities, amenity]
          };
        }
        return room;
      })
    }));
  };

  const getFurnitureDefaults = (type) => {
    switch (type) {
      case 'dining':
        return { seats: 4 };
      case 'sofabed':
        return { width: 140, seats: 3 };
      case 'sofa':
        return { seats: 3 };
      case 'bed':
        return { width: 150 };
      default:
        return {};
    }
  };

  const toggleFacility = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  if (!isOpen) return null;

  const progress = (currentStep / 5) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full h-full sm:h-[90vh] sm:max-h-[800px] sm:max-w-[1100px] sm:rounded-2xl flex flex-col sm:flex-row overflow-hidden shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Sidebar - Compact on mobile */}
        <div className="w-full sm:w-[35%] bg-gray-50 p-4 sm:p-10 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-gray-200 flex-shrink-0">
          <div>
            <div className="font-extrabold italic text-xl sm:text-2xl mb-4 sm:mb-12">
              digihome
            </div>

            {/* Dynamic Sidebar Content - Hidden text on small mobile */}
            <div className="hidden sm:block">
              <SidebarContent step={currentStep} />
            </div>
          </div>

          {/* Progress Bar - Always visible */}
          <div className="mt-3 sm:mt-6">
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2">
              <span>Steg {currentStep} av 5</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all duration-400 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-12">
            {currentStep === 1 && <Step1 formData={formData} updateFormData={updateFormData} />}
            {currentStep === 2 && <Step2 formData={formData} updateFormData={updateFormData} />}
            {currentStep === 3 && (
              <Step3
                formData={formData}
                addRoom={addRoom}
                removeRoom={removeRoom}
                addFurniture={addFurniture}
                removeFurniture={removeFurniture}
                updateFurniture={updateFurniture}
                toggleAmenity={toggleAmenity}
              />
            )}
            {currentStep === 4 && <Step4 formData={formData} updateFormData={updateFormData} toggleFacility={toggleFacility} />}
            {currentStep === 5 && <Step5 formData={formData} updateFormData={updateFormData} />}
          </div>

          {/* Footer - Always visible and sticky */}
          <div className="border-t border-gray-200 p-3 sm:p-6 flex items-center justify-end gap-3 sm:gap-4 bg-white flex-shrink-0">
            {currentStep === 5 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm sm:text-base"
              >
                <ChevronLeft className="w-4 h-4" />
                Tilbake
              </button>
            ) : currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                Tilbake
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm sm:text-base ${
                currentStep === 5
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                'Lagrer...'
              ) : currentStep === 5 ? (
                <>
                  Fullfør
                  <Check className="w-5 h-5 stroke-[3]" />
                </>
              ) : (
                'Neste'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Content Component
const SidebarContent = ({ step }) => {
  const content = {
    1: {
      title: 'Velkommen!',
      text: 'La oss starte med å bekrefte adressen og boligtypen for å gi deg et nøyaktig estimat.',
      extra: (
        <div className="flex items-start gap-4 mt-6">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 text-sm font-bold">
            S
          </div>
          <div>
            <div className="font-semibold text-sm">Sarah fra Digihome</div>
            <div className="text-sm text-gray-500 mt-1">"Vi sjekker data mot lignende boliger."</div>
          </div>
        </div>
      )
    },
    2: {
      title: 'Maksimer din inntekt',
      text: '',
      extra: (
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-sm mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            Visste du at?
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Korttidsutleie gir i snitt <strong>35% høyere inntekt</strong> enn langtidsutleie i Bergen sentrum.
          </p>
        </div>
      )
    },
    3: {
      title: 'Detaljer om boligen',
      text: 'Beskriv rommene og møblene for å sikre korrekt verdivurdering.',
      extra: (
        <div className="bg-white p-5 rounded-xl shadow-sm mt-5">
          <div className="flex items-center gap-2 font-semibold text-sm mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            Tips
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Detaljerte beskrivelser øker sjansen for utleie med <strong>25%</strong>.
          </p>
        </div>
      )
    },
    4: {
      title: 'Nøkkelfasiliteter',
      text: 'Hos Digihome krever vi at eiendommer er fullt møblert med gode fasiliteter. Her angir du kun viktige tilleggsfasiliteter.',
      extra: null
    },
    5: {
      title: 'Siste innspurt!',
      text: 'Gode bilder og en ren bolig er nøkkelen til fornøyde gjester.',
      extra: (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-center gap-3 mt-5">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">Du er snart klar til publisering!</span>
        </div>
      )
    }
  };

  const current = content[step];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight">{current.title}</h1>
      {current.text && <p className="text-gray-600 leading-relaxed mb-4">{current.text}</p>}
      {current.extra}
    </div>
  );
};

// Step 1: Address
const Step1 = ({ formData, updateFormData }) => {
  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-medium mb-2">Bekreft adresse</h2>
        <p className="text-sm sm:text-base text-gray-500">Sjekk at informasjonen stemmer.</p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Adresse</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Sted</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Bolignummer / Etasje (Valgfritt)</label>
          <input
            type="text"
            placeholder="F.eks. H0301"
            value={formData.unit}
            onChange={(e) => updateFormData('unit', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Hva slags bolig er dette?</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectionCard
              selected={formData.propertyType === 'apartment'}
              onClick={() => updateFormData('propertyType', 'apartment')}
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              }
              title="Leilighet"
            />
            <SelectionCard
              selected={formData.propertyType === 'house'}
              onClick={() => updateFormData('propertyType', 'house')}
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
              title="Hus / Rekkehus"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">EIERFORM</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => updateFormData('ownershipType', 'selveier')}
              className={`px-4 py-4 border rounded-lg text-base transition-all ${
                formData.ownershipType === 'selveier'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300 hover:border-gray-900'
              }`}
            >
              Selveier
            </button>
            <button
              onClick={() => updateFormData('ownershipType', 'borettslag')}
              className={`px-4 py-4 border rounded-lg text-base transition-all ${
                formData.ownershipType === 'borettslag'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300 hover:border-gray-900'
              }`}
            >
              Borettslag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Strategy
const Step2 = ({ formData, updateFormData }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-medium mb-2">Velg utleiestrategi</h2>
        <p className="text-gray-500">Hvordan ønsker du å leie ut boligen?</p>
      </div>

      <div className="space-y-4 mb-8">
        <StrategyCard
          selected={formData.rentalStrategy === 'airbnb'}
          onClick={() => updateFormData('rentalStrategy', 'airbnb')}
          icon={
            <svg className="w-6 h-6" style={{ color: '#FF5A5F' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          title="Airbnb"
          description="For deg som er borte om sommeren."
          isAirbnb
        />
        <StrategyCard
          selected={formData.rentalStrategy === 'long'}
          onClick={() => updateFormData('rentalStrategy', 'long')}
          icon={
            <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          }
          title="Langtidsutleie"
          description="Fast leietaker (min. 3 mnd). Stabil inntekt."
        />
        <StrategyCard
          selected={formData.rentalStrategy === 'dynamic'}
          onClick={() => updateFormData('rentalStrategy', 'dynamic')}
          icon={
            <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          }
          title="Dynamisk Utleie"
          description="AI bytter automatisk mellom kort- og langtid."
          badge="ANBEFALT"
          isPurple
        />
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2">Fra dato</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData('startDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Til dato</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => updateFormData('endDate', e.target.value)}
            placeholder="Valgfritt"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

// Step 3: Property Details
const Step3 = ({ formData, addRoom, removeRoom, addFurniture, removeFurniture, updateFurniture, toggleAmenity }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-medium mb-2">Detaljer om boligen</h2>
        <p className="text-gray-500">Beskriv rommene og møblene i boligen.</p>
      </div>

      {/* Living Rooms */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-100">
          <span className="font-semibold">Stue</span>
          <button
            onClick={() => addRoom('living')}
            className="text-blue-600 text-sm font-medium hover:opacity-70 transition-opacity"
          >
            + Legg til rom
          </button>
        </div>
        <div className="space-y-4">
          {formData.livingRooms.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              index={index}
              type="living"
              onRemove={() => removeRoom('living', room.id)}
              onAddFurniture={(furnitureType) => addFurniture('living', room.id, furnitureType)}
              onRemoveFurniture={(furnitureId) => removeFurniture('living', room.id, furnitureId)}
              onUpdateFurniture={(furnitureId, field, value) => updateFurniture('living', room.id, furnitureId, field, value)}
            />
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-100">
          <span className="font-semibold">Soverom</span>
          <button
            onClick={() => addRoom('bedroom')}
            className="text-blue-600 text-sm font-medium hover:opacity-70 transition-opacity"
          >
            + Legg til rom
          </button>
        </div>
        <div className="space-y-4">
          {formData.bedrooms.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              index={index}
              type="bedroom"
              onRemove={() => removeRoom('bedroom', room.id)}
              onAddFurniture={(furnitureType) => addFurniture('bedroom', room.id, furnitureType)}
              onRemoveFurniture={(furnitureId) => removeFurniture('bedroom', room.id, furnitureId)}
              onUpdateFurniture={(furnitureId, field, value) => updateFurniture('bedroom', room.id, furnitureId, field, value)}
            />
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-100">
          <span className="font-semibold">Bad</span>
          <button
            onClick={() => addRoom('bathroom')}
            className="text-blue-600 text-sm font-medium hover:opacity-70 transition-opacity"
          >
            + Legg til rom
          </button>
        </div>
        <div className="space-y-4">
          {formData.bathrooms.map((room, index) => (
            <BathroomCard
              key={room.id}
              room={room}
              index={index}
              onRemove={() => removeRoom('bathroom', room.id)}
              onToggleAmenity={(amenity) => toggleAmenity(room.id, amenity)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Room Card Component
const RoomCard = ({ room, index, type, onRemove, onAddFurniture, onRemoveFurniture, onUpdateFurniture }) => {
  const roomTitle = type === 'living' ? 'Stue' : 'Soverom';
  
  const furnitureOptions = type === 'living' 
    ? [
        { type: 'dining', label: 'Spisebord' },
        { type: 'sofabed', label: 'Sovesofa' },
        { type: 'sofa', label: 'Sofa' }
      ]
    : [
        { type: 'bed', label: 'Seng' }
      ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
        <span className="font-semibold">
          {roomTitle} {index + 1}
        </span>
        <button
          onClick={onRemove}
          className="text-red-500 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          Fjern
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {furnitureOptions.map(option => (
          <button
            key={option.type}
            onClick={() => onAddFurniture(option.type)}
            className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            + {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {room.furniture && room.furniture.map(furniture => (
          <FurnitureItem
            key={furniture.id}
            furniture={furniture}
            onRemove={() => onRemoveFurniture(furniture.id)}
            onUpdate={(field, value) => onUpdateFurniture(furniture.id, field, value)}
          />
        ))}
      </div>
    </div>
  );
};

// Furniture Item Component
const FurnitureItem = ({ furniture, onRemove, onUpdate }) => {
  const getFurnitureLabel = (type) => {
    const labels = {
      dining: 'Spisebord',
      sofabed: 'Sovesofa',
      sofa: 'Sofa',
      bed: 'Seng'
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium text-sm">{getFurnitureLabel(furniture.type)}:</span>
        
        {furniture.type === 'dining' && (
          <>
            <input
              type="number"
              value={furniture.details.seats}
              onChange={(e) => onUpdate('seats', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            />
            <span className="text-sm text-gray-500">plasser</span>
          </>
        )}
        
        {furniture.type === 'sofabed' && (
          <>
            <input
              type="number"
              value={furniture.details.width}
              onChange={(e) => onUpdate('width', parseInt(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            />
            <span className="text-sm text-gray-500 mr-3">cm</span>
            <input
              type="number"
              value={furniture.details.seats}
              onChange={(e) => onUpdate('seats', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            />
            <span className="text-sm text-gray-500">seter</span>
          </>
        )}
        
        {furniture.type === 'sofa' && (
          <>
            <input
              type="number"
              value={furniture.details.seats}
              onChange={(e) => onUpdate('seats', parseInt(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            />
            <span className="text-sm text-gray-500">seter</span>
          </>
        )}
        
        {furniture.type === 'bed' && (
          <>
            <input
              type="number"
              value={furniture.details.width}
              onChange={(e) => onUpdate('width', parseInt(e.target.value))}
              step="10"
              className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            />
            <span className="text-sm text-gray-500">cm</span>
          </>
        )}
      </div>
      
      <button
        onClick={onRemove}
        className="text-red-500 hover:opacity-70 transition-opacity ml-2"
      >
        ✕
      </button>
    </div>
  );
};

// Bathroom Card Component
const BathroomCard = ({ room, index, onRemove, onToggleAmenity }) => {
  const amenitiesOptions = [
    { id: 'dusj', label: 'Dusj' },
    { id: 'badekar', label: 'Badekar' },
    { id: 'toalett', label: 'Toalett' },
    { id: 'vask', label: 'Vask' },
    { id: 'speil', label: 'Speil' },
    { id: 'oppbevaring', label: 'Oppbevaring' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
        <span className="font-semibold">Bad {index + 1}</span>
        <button
          onClick={onRemove}
          className="text-red-500 text-sm font-medium hover:opacity-70 transition-opacity"
        >
          Fjern
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {amenitiesOptions.map(amenity => (
          <label key={amenity.id} className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={room.amenities?.includes(amenity.id)}
              onChange={() => onToggleAmenity(amenity.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            {amenity.label}
          </label>
        ))}
      </div>
    </div>
  );
};

// Step 4: Facilities
const Step4 = ({ formData, toggleFacility, updateFormData }) => {
  const facilities = [
    { id: 'balkong', label: 'Balkong', icon: '🏢' },
    { id: 'tørketrommel', label: 'Tørketrommel', icon: '⚙️' },
    { id: 'heis', label: 'Heis', icon: '📱' }
  ];

  const parkingOptions = [
    { value: 'none', label: 'Ingen' },
    { value: 'free', label: 'Gratis' },
    { value: 'garage', label: 'Garasje' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-medium mb-2">Nøkkelfasiliteter</h2>
        <p className="text-gray-500">Angi viktige tilleggsfasiliteter for eiendommen.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3">Tilleggsfasiliteter</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {facilities.map(facility => (
              <div
                key={facility.id}
                onClick={() => toggleFacility(facility.id)}
                className={`border rounded-xl p-5 cursor-pointer transition-all text-center min-h-[120px] flex flex-col items-center justify-center ${
                  formData.facilities.includes(facility.id)
                    ? 'bg-blue-50 border-blue-500 text-blue-600 font-semibold'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
              >
                <div className="text-2xl mb-2">{facility.icon}</div>
                <span>{facility.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Parkering</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {parkingOptions.map(option => (
              <div
                key={option.value}
                onClick={() => updateFormData('parking', option.value)}
                className={`border rounded-xl p-5 cursor-pointer transition-all text-center ${
                  formData.parking === option.value
                    ? 'bg-blue-50 border-blue-500 text-blue-600 font-semibold'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-blue-900">
          <h4 className="font-semibold mb-2">Digihome-standard:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Alle eiendommer må være fullt møblert</li>
            <li>Grunnleggende fasiliteter som kjøkken, bad og WiFi er påkrevd</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Step 5: Presentation & Prep
const Step5 = ({ formData, updateFormData }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-medium mb-2">Presentasjon & Klargjøring</h2>
        <p className="text-gray-500">Gjør boligen klar for markedet.</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="font-medium mb-4">1. Fotografering</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PhotoOption
              selected={formData.photography === 'professional'}
              onClick={() => updateFormData('photography', 'professional')}
              iconBg="bg-gray-900"
              iconColor="text-white"
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              }
              title="Bestill Fotograf"
              description="Proff fotograf. Inkluderer redigering."
              price="2 500 kr"
            />
            <PhotoOption
              selected={formData.photography === 'upload'}
              onClick={() => updateFormData('photography', 'upload')}
              iconBg="bg-gray-100"
              iconColor="text-gray-600"
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              }
              title="Last opp selv"
              description="Bruk egne bilder med AI-forbedring."
              price="Gratis"
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">2. Første utvask før oppstart</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CleaningOption
              selected={formData.cleaning === 'self'}
              onClick={() => updateFormData('cleaning', 'self')}
              title="Jeg vasker selv"
              subtitle="Gratis"
            />
            <CleaningOption
              selected={formData.cleaning === 'service'}
              onClick={() => updateFormData('cleaning', 'service')}
              title="Bestill nedvask"
              subtitle="3 500 kr"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const SelectionCard = ({ selected, onClick, icon, title }) => (
  <div
    onClick={onClick}
    className={`border rounded-xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
      selected ? 'border-2 border-gray-900' : 'border border-gray-300 hover:border-gray-900'
    }`}
  >
    <div className="text-gray-500 mb-3">{icon}</div>
    <div className="font-semibold text-lg">{title}</div>
  </div>
);

const StrategyCard = ({ selected, onClick, icon, title, description, badge, isPurple, isAirbnb }) => (
  <div
    onClick={onClick}
    className={`border rounded-xl p-5 cursor-pointer transition-all flex items-center gap-4 relative ${
      isAirbnb
        ? selected
          ? 'bg-red-50 border-[#FF5A5F]'
          : 'bg-red-50/30 border-red-200 hover:border-red-300'
        : isPurple
        ? selected
          ? 'bg-purple-50 border-purple-500'
          : 'bg-purple-50/50 border-purple-200 hover:border-purple-300'
        : selected
        ? 'border-2 border-gray-900'
        : 'border border-gray-300 hover:border-gray-900'
    }`}
  >
    {badge && (
      <div className="absolute -top-2 right-3 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
        {badge}
      </div>
    )}
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <div className={`font-semibold text-lg ${isPurple ? 'text-purple-600' : isAirbnb ? 'text-[#FF5A5F]' : ''}`}>
        {title}
      </div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  </div>
);

const PhotoOption = ({ selected, onClick, iconBg, iconColor, icon, title, description, price }) => (
  <div
    onClick={onClick}
    className={`border rounded-xl p-6 cursor-pointer transition-all flex flex-col items-center text-center gap-4 ${
      selected ? 'border-2 border-gray-900' : 'border border-gray-300 hover:border-gray-900'
    }`}
  >
    <div className={`w-12 h-12 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-gray-500 mb-2">{description}</div>
      <div className="font-bold text-sm">{price}</div>
    </div>
  </div>
);

const CleaningOption = ({ selected, onClick, title, subtitle }) => (
  <div
    onClick={onClick}
    className={`border rounded-xl p-6 cursor-pointer transition-all text-center ${
      selected ? 'border-2 border-gray-900' : 'border border-gray-300 hover:border-gray-900'
    }`}
  >
    <div className="font-bold mb-1">{title}</div>
    <div className="text-sm text-gray-500">{subtitle}</div>
  </div>
);

export default PropertyOnboardingModal;
