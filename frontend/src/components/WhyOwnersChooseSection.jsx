import React from 'react';
import { TrendingUp, HandMetal, MapPin } from 'lucide-react';

const WhyOwnersChooseSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Higher earnings',
      description: 'Smart pricing and zero vacancy juggling',
    },
    {
      icon: HandMetal,
      title: 'Hands-off management',
      description: 'For both Airbnb and long-term rental',
    },
    {
      icon: MapPin,
      title: 'Real local teams',
      description: 'Handle everything on-site and maintain high standards',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            Why Owners Choose DigiHome
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto">
            DigiHome consistently outperforms the market by focusing on what matters most to property owners:
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
              >
                <div className="flex flex-col items-start space-y-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300 shadow-sm">
                    <Icon className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-base text-gray-600 font-light leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyOwnersChooseSection;