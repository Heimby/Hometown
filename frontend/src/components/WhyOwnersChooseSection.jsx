import React from 'react';
import { Shield, TrendingUp, Users, CheckCircle } from 'lucide-react';

const WhyOwnersChooseSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Regulatory Compliance & Property Enhancement',
    },
    {
      icon: Users,
      title: '24/7 Customer Support',
    },
    {
      icon: TrendingUp,
      title: 'Revenue Maximization',
    },
    {
      icon: CheckCircle,
      title: 'Routine Maintenance & Smart Energy Management',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Title */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-xl border border-gray-100">
              <h2 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tight leading-tight">
                Owners
              </h2>
              <div className="mt-6 w-20 h-1 bg-gray-900 rounded-full"></div>
            </div>
          </div>

          {/* Right Side - Benefits */}
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

            {/* CTA Button */}
            <div className="pt-6">
              <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Discover solutions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyOwnersChooseSection;