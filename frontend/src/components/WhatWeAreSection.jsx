import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const WhatWeAreSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const services = [
    {
      title: 'Airbnb-utleie',
      description: 'Vi håndterer hele Airbnb-prosessen for deg: fra opprettelse av annonse med profesjonelle bilder, til prissetting, gjestekommunikasjon, og rengjøring etter hvert opphold. Du trenger ikke å bekymre deg for noe - vi sørger for at boligen din tjener best mulig mens gjestene får en perfekt opplevelse.'
    },
    {
      title: 'Langtidsutleie',
      description: 'Vi tar oss av alt ved langtidsutleie: annonsering, visninger, leietakersjekk, kontrakt, innflytting og løpende kommunikasjon med leietaker. Du får en trygg og problemfri utleiehverdag med faste månedlige inntekter, mens vi holder kontakten med leietaker og følger opp eventuelle behov.'
    },
    {
      title: 'Dynamisk (10-2)',
      description: 'Vår unike 10-2 modell gir deg det beste fra begge verdener: 10 måneder langtidsutleie med stabil inntekt, og 2 måneder Airbnb i høysesongen for maksimal avkastning. Vi håndterer overgangen sømløst, slik at du får trygghet og forutsigbarhet kombinert med høyere inntjening når det er mest etterspørsel.'
    }
  ];

  return (
    <section className="relative py-0 px-6 bg-white">
      <div className="relative min-h-[600px] mx-auto" style={{ maxWidth: '95%' }}>
        {/* Background Image */}
        <img
          src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/6utvdueb_the_image_carries_image.jpeg"
          alt="Property Management"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto py-16 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-6" style={{ backgroundColor: '#ededed' }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Vår metode
              </h2>
              
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  DigiHome hjelper deg med å finne den mest lønnsomme løsningen for boligen din.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Vi tar oss av hele prosessen – du får en trygg og enkel hverdag.
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  Hvorfor velge DigiHome?
                </h3>
                <ul className="space-y-2 text-base text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Opp til 30% høyere leieinntekter</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>100% redusert tidsbruk</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Mer data og oversikt</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="border-b border-gray-300 pb-3">
                    <button
                      onClick={() => toggleExpand(index)}
                      className="w-full flex items-center justify-between text-left py-2 hover:opacity-70 transition-opacity"
                    >
                      <span className="text-lg md:text-xl font-semibold text-gray-900">
                        {service.title}
                      </span>
                      {expandedIndex === index ? (
                        <Minus className="w-5 h-5 text-gray-700 flex-shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-700 flex-shrink-0" />
                      )}
                    </button>
                    {expandedIndex === index && (
                      <div className="mt-3 text-base text-gray-700 leading-relaxed animate-fade-in">
                        {service.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeAreSection;
