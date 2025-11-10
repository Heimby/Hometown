import React from 'react';

const ResultsSection = () => {
  const results = [
    {
      title: '30% increased rent',
      description: 'Smart pricing and dual-rental strategy maximizes your property income',
    },
    {
      title: '100% less time spent on tenant management',
      description: 'We handle all guest and tenant interactions, freeing your time completely',
    },
    {
      title: 'Better overview on property costs',
      description: 'Full transparency through your Owner Portal with detailed reporting',
    },
  ];

  return (
    <section className="relative py-0 px-6 bg-white">
      <div className="relative min-h-[600px] mx-auto" style={{ maxWidth: '95%' }}>
        {/* Background Image */}
        <img
          src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/f0coiy18_image_of_a_norwegi_image.jpeg"
          alt="Property Results"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto py-16 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Empty left column */}
            <div></div>
            
            {/* Content card on the right */}
            <div className="rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-6" style={{ backgroundColor: '#ededed' }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Results From Real Properties
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Our data-driven approach consistently delivers exceptional results for property owners across Norway.
              </p>

              <div className="space-y-6">
                {results.map((result, index) => {
                  const Icon = result.icon;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                          {result.title}
                        </h3>
                      </div>
                      <p className="text-base text-gray-700 leading-relaxed pl-13">
                        {result.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;