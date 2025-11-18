import React from 'react';
import { MapPin, Phone, Zap, Shield, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: MapPin,
      title: 'Del din bolig',
      subtitle: 'Raskt & Enkelt',
      description: 'Tell us your address and we will instantly analyze your earning potential.',
      color: 'gray',
    },
    {
      number: '02',
      icon: Phone,
      title: 'Strategisamtale',
      subtitle: '15-minutters samtale',
      description: 'We review your property and recommend the best rental strategy for maximum returns.',
      color: 'gray',
    },
    {
      number: '03',
      icon: Zap,
      title: 'Rask digital oppstart',
      subtitle: 'Lansering samme uke',
      description: 'Our local team handles photos, setup, and checks while you relax.',
      color: 'gray',
    },
    {
      number: '04',
      icon: Shield,
      title: 'Vi håndterer alt',
      subtitle: 'Problemfri inntekt',
      description: 'From guests to maintenance, we manage it all with local care and digital efficiency.',
      color: 'purple',
    },
  ];

  const colorClasses = {
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: 'bg-gray-900',
      text: 'text-gray-600',
      number: 'text-gray-300',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'bg-purple-500',
      text: 'text-purple-700',
      number: 'text-purple-300',
    },
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            From zero to earning in <span className="font-semibold text-gray-900">4 simple steps</span>
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colors = colorClasses[step.color];
            
            return (
              <div key={index} className="relative group">
                {/* Arrow between cards (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </div>
                )}

                {/* Card */}
                <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-5 sm:p-6 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                  {/* Icon */}
                  <div className="mb-4 sm:mb-5">
                    <div className={`${colors.icon} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <span className={`${colors.text} text-[10px] sm:text-xs font-semibold uppercase tracking-wider`}>
                      {step.subtitle}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center px-4">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white rounded-full shadow-lg">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Get started in less than 5 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;