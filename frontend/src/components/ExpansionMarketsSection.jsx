import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';

const ExpansionMarketsSection = () => {
  const countries = [
    {
      flag: '🇳🇱',
      name: 'Netherlands',
    },
    {
      flag: '🇩🇪',
      name: 'Germany',
    },
    {
      flag: '🇫🇷',
      name: 'France',
    },
    {
      flag: '🇫🇮',
      name: 'Finland',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="mx-auto" style={{ maxWidth: '95%' }}>
        {/* Heading */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            Expansion Markets
          </h2>
          <p className="text-2xl text-gray-700 font-light">
            Pioneer the Next Wave
          </p>
          <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto pt-4">
            We're launching DigiHome in the Netherlands, Germany, France, and Finland. Early adopters can join as pioneers and receive exclusive benefits before full rollout.
          </p>
        </div>

        {/* Country Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {countries.map((country, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-900"
            >
              <div className="flex flex-col items-center space-y-4">
                <span className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                  {country.flag}
                </span>
                <p className="text-lg font-medium text-gray-900 text-center">
                  {country.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Open to Other Markets */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-dashed border-gray-200 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <Globe className="w-7 h-7 text-gray-700" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg font-medium text-gray-900">
                Interested in bringing DigiHome to your market?
              </p>
              <p className="text-sm text-gray-600 font-light">
                We're open to expansion in other European markets. Get in touch to pioneer DigiHome in your region.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <button className="group inline-flex items-center space-x-3 px-10 py-4 bg-gray-900 text-white rounded-2xl text-lg font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <span>Join as Pioneer</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600 font-light">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span>Special pricing</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span>Priority onboarding</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span>Founding member status</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpansionMarketsSection;