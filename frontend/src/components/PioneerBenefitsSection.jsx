import React from 'react';
import { Percent, Headphones, Award, MessageSquare } from 'lucide-react';

const PioneerBenefitsSection = () => {
  const benefits = [
    {
      icon: Percent,
      title: 'Up to 40% Discount',
      description: 'Exclusive first-year pricing for early adopters.',
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      description: 'Dedicated onboarding and personalized account management.',
    },
    {
      icon: Award,
      title: 'Founding Member Status',
      description: 'Lifetime recognition and continuous access to exclusive perks.',
    },
    {
      icon: MessageSquare,
      title: 'Shape the Service',
      description: 'Pioneers get direct input into how DigiHome evolves and adapts in their market.',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto" style={{ maxWidth: '95%' }}>
        {/* Heading */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            Pioneer Benefits
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-900"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-12">
          <p className="text-base text-gray-600 font-light italic">
            Limited spots available. Join the founding cohort.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PioneerBenefitsSection;