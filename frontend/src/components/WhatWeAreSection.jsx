import React from 'react';

const WhatWeAreSection = () => {
  return (
    <section className="relative py-24 px-6 min-h-[600px]">
      {/* Background Image */}
      <img
        src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/6utvdueb_the_image_carries_image.jpeg"
        alt="Property Management"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-6" style={{ backgroundColor: '#ededed' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What We Are
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              DigiHome is Norway's only full-stack property management company offering both 
              Airbnb management and long-term rental management under one roof.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Complete Management
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  We handle pricing, guest communication, tenant management, and property care, 
                  so owners earn more with less stress.
                </p>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Full Transparency
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Everything is supported by a simple Owner Portal that keeps you fully informed 
                  about your property performance and operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeAreSection;
