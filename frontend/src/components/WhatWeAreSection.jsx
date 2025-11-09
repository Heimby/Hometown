import React from 'react';
import { Home, Users, TrendingUp, Shield } from 'lucide-react';

const WhatWeAreSection = () => {
  const features = [
    {
      icon: Home,
      title: 'Airbnb Management',
      description: 'Dynamic pricing and guest communication',
    },
    {
      icon: Users,
      title: 'Long-term Rentals',
      description: 'Tenant management and lease administration',
    },
    {
      icon: TrendingUp,
      title: 'Smart Pricing',
      description: 'Maximize earnings across both rental types',
    },
    {
      icon: Shield,
      title: 'Property Care',
      description: 'Maintenance and quality assurance',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            What We Are
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
              DigiHome is Norway's only full-stack property management company offering both 
              Airbnb management and long-term rental management under one roof. We handle pricing, 
              guest communication, tenant management, and property care, so owners earn more with 
              less stress. Everything is supported by a simple Owner Portal that keeps them fully informed.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-base text-gray-600 font-light">
            One partner. Complete property management. Maximum returns.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatWeAreSection;
