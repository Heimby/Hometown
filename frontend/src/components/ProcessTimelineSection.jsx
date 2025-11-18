import React from 'react';
import { FileText, Image, Settings, BarChart3, ChevronRight } from 'lucide-react';

const ProcessTimelineSection = () => {
  const steps = [
    {
      icon: FileText,
      title: 'Et kort møte (ca. 30 min)',
      description: 'Vi tar et kjapt Teams-møte der vi forklarer hvordan alt fungerer, og diskuterer hva som passer best for deg – om du vil ta renholdet selv, bruke lokale ungdommer eller et profesjonelt vaskefirma.\nVi ser også på praktiske løsninger som selvbetjent innsjekk og nøkkelhåndtering.',
    },
    {
      icon: Image,
      title: 'Du sender bilder – vi fikser resten',
      description: 'Etter møtet sender du noen mobilbilder av boligen.\nVi redigerer bildene, skriver annonsen og setter opp en Airbnb-profil som ser profesjonell ut – klar for første gjest.',
    },
    {
      icon: Settings,
      title: 'Smart prising med AI',
      description: 'Vi aktiverer AI-basert prising som automatisk justerer prisene etter etterspørsel og sesong, slik at du får mest mulig ut av utleien.',
    },
    {
      icon: BarChart3,
      title: 'Trygg oppstart og støtte',
      description: 'Vi følger deg tett i starten til du føler deg trygg på systemet og har full kontroll selv.\nEtter det kan du enkelt drifte alt videre – uten stress.',
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-start">
            <div className="mb-4">
              <div className="text-sm font-semibold uppercase tracking-wider text-gray-600">
                Prosess
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Hvordan vi gjør Airbnb enkelt for deg
            </h2>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Start
              </button>
              <button className="flex items-center gap-2 text-gray-900 font-medium hover:opacity-70 transition-opacity">
                <span>Mer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Content - Timeline */}
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            {/* Timeline Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative flex gap-6">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white z-10 relative">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimelineSection;
