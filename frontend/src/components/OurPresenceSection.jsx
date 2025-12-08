import React from 'react';
import { MapPin } from 'lucide-react';

const OurPresenceSection = () => {
  const norwayLocations = [
    'Stavanger',
    'Bergen',
    'Oslo',
    'Trondheim',
    'Bodø',
    'Tromsø',
    'Haugesund',
  ];

  return (
    <section className="relative py-0 px-0 sm:px-6" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="relative min-h-[600px] mx-auto" style={{ maxWidth: '100%' }}>
        <img
          src="https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/o346zaa7_create_a_mix_of_no_image%20%281%29.jpeg"
          alt="Norway Properties"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-6xl mx-auto py-16 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-6" style={{ backgroundColor: '#ededed' }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Norges største tilstedeværelse innen utleie
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Heimby er det største og mest utbredte eiendomsforvaltningsselskapet i Norge. Vi har lokale team i alle våre markeder.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🇳🇴</span>
                    <h3 className="text-xl font-bold text-gray-900">Norge</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {norwayLocations.map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200"
                      >
                        <MapPin className="w-4 h-4 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">{location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🌍</span>
                    <h3 className="text-xl font-bold text-gray-900">Ekspansjon</h3>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-base font-medium text-gray-900">Vi ser aktivt på muligheter i nye markeder</p>
                    <p className="text-sm text-gray-600">Europeisk ekspansjon planlegges</p>
                  </div>
                </div>
              </div>

              <p className="text-base text-gray-600 font-light italic mt-4">
                Lokale team. Lokal ekspertise. Konsistent kvalitet.
              </p>
            </div>

            <div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPresenceSection;