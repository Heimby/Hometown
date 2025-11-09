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
      description: 'Digital onboarding keeps things effortless, while our local field teams handle photos, cleaning standards, listing setup, and property checks. Owners receive access to the Owner Portal for full transparency.',
    },
    {
      number: '4',
      icon: Shield,
      title: 'We manage everything',
      description: 'Local teams take care of guests, tenants, cleaning, maintenance, pricing, and reporting. Digital tools make it smooth, but the service is human.',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              We keep the process simple and incredibly fast. Our digital onboarding makes us the fastest property management firm in Europe to get a home live. And while onboarding is digital, all daily service is delivered by real, local teams who live where your property is.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-medium">
                        {step.number}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300">
                        <Icon className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-medium text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-base text-gray-600 font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Tagline */}
        <div className="text-center">
          <p className="text-base text-gray-700 font-medium italic">
            Digital where it helps. Local where it matters.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;