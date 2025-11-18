import React from 'react';
import { Globe } from 'lucide-react';

const ExpansionMarketsSection = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Ekspanderer i Europa
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Vi bringer DigiHome til nye markeder i Europa. Bli med som pioner i din region og få eksklusive grunnleggerfordeler.
          </p>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-50 p-6 rounded-full border border-gray-200">
            <Globe className="w-12 h-12 text-gray-700" />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="inline-flex items-center px-6 sm:px-8 py-3 bg-gray-900 text-white rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors shadow-md">
            Bli med som pioner
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Begrenset antall plasser for grunnleggere
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExpansionMarketsSection;
