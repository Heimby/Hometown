import React from 'react';
import { Shield, TrendingUp, Users, CheckCircle } from 'lucide-react';

const WhyOwnersChooseSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Regelverksoverholdelse & Eiendomsforbedring',
    },
    {
      icon: Users,
      title: '24/7 Kundestøtte',
    },
    {
      icon: TrendingUp,
      title: 'Inntektsmaksimering',
    },
    {
      icon: CheckCircle,
      title: 'Rutinemessig Vedlikehold & Smart Energistyring',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
                alt="Eiendomseier"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
                      {benefit.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyOwnersChooseSection;