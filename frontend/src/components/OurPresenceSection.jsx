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

  const international = {
    location: 'Costa del Sol, Spania',
    description: 'Norsk-kvalitetsforvaltning',
  };

  return (
    <section className="relative py-0 px-6 bg-white">
      <div className="relative min-h-[600px] mx-auto" style={{ maxWidth: '95%' }}>
        {/* Background Image */}
        <img
          src="https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/o346zaa7_create_a_mix_of_no_image%20%281%29.jpeg"
          alt="Norway Properties"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto py-16 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content card on the left */}
            <div className="rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-6" style={{ backgroundColor: '#ededed' }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Norges største tilstedeværelse innen eiendomsforvaltning
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                DigiHome er det største og mest utbredte eiendomsforvaltningsselskapet i Norge. Vi opererer med fulle, lokale team på bakken over hele landet.
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
                    <span className="text-2xl">🇪🇸</span>
                    <h3 className="text-xl font-bold text-gray-900">Internasjonalt</h3>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-base font-medium text-gray-900">{international.location}</p>
                    <p className="text-sm text-gray-600">{international.description}</p>
                  </div>
                </div>
              </div>

              <p className="text-base text-gray-600 font-light italic mt-4">
                Ekte lokale team. Virkelig lokal tilstedeværelse. Konsistent kvalitet overalt.
              </p>
            </div>

            {/* Empty right column */}
            <div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPresenceSection;