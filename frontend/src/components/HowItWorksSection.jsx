import React from 'react';
import { MapPin, Phone, Zap, Shield } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      icon: MapPin,
      title: 'Tell us your address',
      description: 'We instantly analyze your earning potential.',
    },
    {
      number: '2',
      icon: Phone,
      title: 'Initial phone call',
      description: 'We review your property and goals, and recommend Airbnb, long-term, or hybrid for maximum returns.',
    },
    {
      number: '3',
      icon: Zap,
      title: 'Lightning-fast onboarding',
      description: 'Digital onboarding keeps things effortless while local teams handle photos, cleaning standards, listing setup, and property checks.',
    },
    {
      number: '4',
      icon: Shield,
      title: 'We manage everything',
      description: 'Local teams care for guests, tenants, cleaning, maintenance, pricing, and reporting, powered by digital tools.',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto" style={{ maxWidth: '95%' }}>
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            A simple, transparent process designed for speed and clarity
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-8 top-6 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-white border-2 border-gray-900 rounded-full shadow-sm"></div>
                  </div>

                  {/* Content Card */}
                  <div className="ml-20">
                    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-start space-x-6">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                            <Icon className="w-6 h-6 text-gray-700" />
                          </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-400">
                              Step {step.number}
                            </span>
                          </div>
                          <h3 className="text-xl font-medium text-gray-900">
                            {step.title}
                          </h3>
                          <p className="text-base text-gray-600 leading-relaxed font-light">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-16">
          <p className="text-base text-gray-500 font-light italic">
            Digital where it helps. Local where it matters.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;