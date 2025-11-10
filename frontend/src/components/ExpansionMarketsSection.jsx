import React from 'react';

const ExpansionMarketsSection = () => {
  const countries = [
    { flag: '🇳🇱', name: 'Netherlands' },
    { flag: '🇩🇪', name: 'Germany' },
    { flag: '🇫🇷', name: 'France' },
    { flag: '🇫🇮', name: 'Finland' },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Expansion Markets
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            We're launching in the Netherlands, Germany, France, and Finland. Join as a pioneer.
          </p>
        </div>

        {/* Country Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {countries.map((country, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 sm:p-6 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-3xl sm:text-4xl">{country.flag}</span>
                <p className="text-sm sm:text-base font-medium text-gray-900">{country.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="inline-flex items-center px-6 sm:px-8 py-3 bg-gray-900 text-white rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors shadow-md">
            Join as Pioneer
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExpansionMarketsSection;
