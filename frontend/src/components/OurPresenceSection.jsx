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

  const internationalLocations = [
    {
      name: 'Costa del Sol',
      country: 'Spain',
      flag: '🇪🇸',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            Norway's Largest Presence in Property Management
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
            DigiHome is the largest and most widely present property management company in Norway. We operate with full, on-the-ground local teams across the country.
          </p>
        </div>

        {/* Norway Locations */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl mr-3">🇳🇴</span>
            <h3 className="text-2xl font-medium text-gray-900">Norway</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {norwayLocations.map((location, index) => (
              <div
                key={index}
                className="group bg-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 text-center">
                    {location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* International Locations */}
        <div>
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-2xl font-medium text-gray-900">International Presence</h3>
          </div>
          <div className="flex justify-center">
            {internationalLocations.map((location, index) => (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 min-w-[280px]"
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-5xl">{location.flag}</span>
                  <div className="text-center">
                    <p className="text-xl font-medium text-gray-900">
                      {location.name}
                    </p>
                    <p className="text-sm text-gray-600 font-light">
                      {location.country}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 font-light text-center">
                    Norwegian-quality management
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-12">
          <p className="text-base text-gray-600 font-light">
            Real local teams. True local presence. Consistent quality everywhere.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurPresenceSection;