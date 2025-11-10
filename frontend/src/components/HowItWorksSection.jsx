import React from 'react';
import { MapPin, Phone, Zap, Shield, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: MapPin,
      title: 'Share Your Property',
      subtitle: 'Quick & Easy',
      description: 'Tell us your address and we'll instantly analyze your earning potential.',
      color: 'emerald',
    },
    {
      number: '02',
      icon: Phone,
      title: 'Strategy Call',
      subtitle: '15-Minute Chat',
      description: 'We review your property and recommend the best rental strategy for maximum returns.',
      color: 'blue',
    },
    {
      number: '03',
      icon: Zap,
      title: 'Fast Digital Setup',
      subtitle: 'Same Week Launch',
      description: 'Our local team handles photos, setup, and checks while you relax.',
      color: 'amber',
    },
    {
      number: '04',
      icon: Shield,
      title: 'We Handle Everything',
      subtitle: 'Hands-Free Earnings',
      description: 'From guests to maintenance, we manage it all with local care and digital efficiency.',
      color: 'purple',
    },
  ];

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: 'bg-emerald-500',
      text: 'text-emerald-700',
      number: 'text-emerald-600',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'bg-blue-500',
      text: 'text-blue-700',
      number: 'text-blue-600',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'bg-amber-500',
      text: 'text-amber-700',
      number: 'text-amber-600',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'bg-purple-500',
      text: 'text-purple-700',
      number: 'text-purple-600',
    },
  };

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From zero to earning in <span className="font-semibold text-gray-900">4 simple steps</span>
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                  {/* Icon and Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${colors.icon} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`${colors.number} text-4xl font-bold opacity-50`}>
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <span className={`${colors.text} text-xs font-semibold uppercase tracking-wider`}>
                      {step.subtitle}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-full shadow-lg">
            <Zap className="w-5 h-5" />
            <span className="font-medium">Get started in less than 5 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;