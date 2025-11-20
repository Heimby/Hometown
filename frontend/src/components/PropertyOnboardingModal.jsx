import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const PropertyOnboardingModal = ({ isOpen, onClose, propertyData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  if (!isOpen) return null;

  const progressPercent = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] max-h-[800px] flex overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Sidebar */}
        <div className="w-[35%] bg-gray-50 p-10 flex flex-col justify-between border-r border-gray-200">
          <div>
            <div className="text-2xl font-bold italic mb-12">digihome</div>
            
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h1 className="text-3xl font-bold mb-4">Velkommen!</h1>
                <p className="text-gray-600 mb-6">
                  La oss starte med å bekrefte adressen og boligtypen for å gi deg et nøyaktig estimat.
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h1 className="text-3xl font-bold mb-4">Maksimer din inntekt</h1>
                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Visste du at?
                  </div>
                  <p className="text-sm text-gray-600">
                    Korttidsutleie gir i snitt <strong>35% høyere inntekt</strong> enn langtidsutleie.
                  </p>
                </div>
              </div>
            )}

            {(currentStep === 3 || currentStep === 4) && (
              <div className="animate-fade-in">
                <h1 className="text-3xl font-bold mb-4">Detaljer om boligen</h1>
                <p className="text-gray-600">
                  Detaljerte beskrivelser øker sjansen for utleie med <strong>25%</strong>.
                </p>
              </div>
            )}

            {currentStep === 5 && (
              <div className="animate-fade-in">
                <h1 className="text-3xl font-bold mb-4">Siste innspurt!</h1>
                <p className="text-gray-600 mb-6">
                  Gode bilder og en ren bolig er nøkkelen til fornøyde gjester.
                </p>
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Du er snart klar til publisering!</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Steg {currentStep} av {totalSteps}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-[65%] flex flex-col">
          <div className="flex-1 overflow-y-auto p-10">
            {currentStep === 1 && (
              <div>
                <h2 className="text-3xl font-medium mb-2">Bekreft adresse</h2>
                <p className="text-gray-500 mb-8">Sjekk at informasjonen stemmer.</p>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Adresse</label>
                      <input
                        type="text"
                        defaultValue={propertyData?.address || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Sted</label>
                      <input
                        type="text"
                        defaultValue="Bergen"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Hva slags bolig er dette?</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-gray-900 bg-white rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50">
                        <div className="text-3xl mb-2">🏢</div>
                        <div className="font-semibold">Leilighet</div>
                      </div>
                      <div className="border border-gray-300 bg-white rounded-xl p-6 text-center cursor-pointer hover:border-gray-900">
                        <div className="text-3xl mb-2">🏠</div>
                        <div className="font-semibold">Hus / Rekkehus</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-3xl font-medium mb-2">Velg utleiestrategi</h2>
                <p className="text-gray-500 mb-8">Hvordan ønsker du å leie ut boligen?</p>
                
                <div className="space-y-4">
                  <div className="border border-gray-300 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-gray-900">
                    <div className="text-2xl">📅</div>
                    <div>
                      <div className="font-semibold">Korttidsutleie</div>
                      <div className="text-sm text-gray-500">Airbnb, Booking.com. Høyest inntekt.</div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-300 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-gray-900">
                    <div className="text-2xl">🏠</div>
                    <div>
                      <div className="font-semibold">Langtidsutleie</div>
                      <div className="text-sm text-gray-500">Fast leietaker. Stabil inntekt.</div>
                    </div>
                  </div>
                  
                  <div className="border-2 border-purple-500 bg-purple-50 rounded-xl p-5 flex items-center gap-4 cursor-pointer relative">
                    <div className="absolute -top-3 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ANBEFALT
                    </div>
                    <div className="text-2xl">⭐</div>
                    <div>
                      <div className="font-semibold text-purple-700">Dynamisk Utleie</div>
                      <div className="text-sm text-gray-600">AI bytter automatisk mellom kort- og langtid.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-3xl font-medium mb-2">Detaljer om boligen</h2>
                <p className="text-gray-500 mb-8">Beskriv rommene i boligen.</p>
                
                <div className="text-center py-12 text-gray-400">
                  <p className="mb-2">📝 Rom-konfigurasjon</p>
                  <p className="text-sm">Dette trinnet er forenklet i denne demoen</p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-3xl font-medium mb-2">Nøkkelfasiliteter</h2>
                <p className="text-gray-500 mb-8">Angi viktige tilleggsfasiliteter.</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-900">
                    <div className="text-2xl mb-2">🪟</div>
                    <div className="text-sm font-medium">Balkong</div>
                  </div>
                  <div className="border border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-900">
                    <div className="text-2xl mb-2">🧺</div>
                    <div className="text-sm font-medium">Tørketrommel</div>
                  </div>
                  <div className="border border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-900">
                    <div className="text-2xl mb-2">🛗</div>
                    <div className="text-sm font-medium">Heis</div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h2 className="text-3xl font-medium mb-2">Presentasjon & Klargjøring</h2>
                <p className="text-gray-500 mb-8">Gjør boligen klar for markedet.</p>
                
                <div className="space-y-4">
                  <div className="border border-gray-300 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-gray-900">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                      📸
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Bestill Fotograf</div>
                      <div className="text-sm text-gray-500">Proff fotograf. Inkluderer redigering.</div>
                    </div>
                    <div className="font-bold">2 500 kr</div>
                  </div>
                  
                  <div className="border border-gray-300 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-gray-900">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      📤
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Last opp selv</div>
                      <div className="text-sm text-gray-500">Bruk egne bilder med AI-forbedring.</div>
                    </div>
                    <div className="font-bold">Gratis</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-between items-center bg-white">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Tilbake
                </button>
              )}
            </div>
            <button
              onClick={handleNext}
              className={`px-8 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                currentStep === totalSteps
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {currentStep === totalSteps ? (
                <>
                  Fullfør
                  <Check className="w-5 h-5" />
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

export default PropertyOnboardingModal;
