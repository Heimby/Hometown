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
    location: 'Costa del Sol, Spain',
    description: 'Norwegian-quality management',
  };

  return (
    <section className="relative py-0 px-6 bg-white">
      <div className="relative min-h-[600px] mx-auto" style={{ maxWidth: '95%' }}>
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1601970243374-069b5f957a9e?q=80&w=2000&auto=format&fit=crop"
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
                Norway's Largest Presence in Property Management
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                DigiHome is the largest and most widely present property management company in Norway. We operate with full, on-the-ground local teams across the country.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🇳🇴</span>
                    <h3 className="text-xl font-bold text-gray-900">Norway</h3>
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
                    <h3 className="text-xl font-bold text-gray-900">International</h3>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                    <p className="text-base font-medium text-gray-900">{international.location}</p>
                    <p className="text-sm text-gray-600">{international.description}</p>
                  </div>
                </div>
              </div>

              <p className="text-base text-gray-600 font-light italic mt-4">
                Real local teams. True local presence. Consistent quality everywhere.
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