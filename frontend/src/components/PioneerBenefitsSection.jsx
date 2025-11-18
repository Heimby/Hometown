import React from 'react';

const PioneerBenefitsSection = () => {
  const benefits = [
    {
      title: 'Up to 40% Discount',
      description: 'Exclusive first-year pricing',
    },
    {
      title: 'Priority Support',
      description: 'Dedicated onboarding',
    },
    {
      title: 'Founding Member',
      description: 'Lifetime recognition',
    },
    {
      title: 'Shape the Service',
      description: 'Direct input on features',
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Pionerfordeler
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="text-center space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 italic">
            Limited spots available
          </p>
        </div>
      </div>
    </section>
  );
};

export default PioneerBenefitsSection;
