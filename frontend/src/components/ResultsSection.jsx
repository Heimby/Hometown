import React from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

const ResultsSection = () => {
  const results = [
    {
      icon: TrendingUp,
      location: 'Stavanger apartment',
      metric: '+32%',
      description: 'vs market average',
    },
    {
      icon: Calendar,
      location: 'Bergen hybrid rental',
      metric: '365 days',
      description: 'Year-round occupancy',
    },
    {
      icon: DollarSign,
      location: 'Oslo Airbnb unit',
      metric: '178,000 NOK',
      description: 'Annual revenue after fees',
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="mx-auto" style={{ maxWidth: '95%' }}>
        {/* Heading */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            Results From Real Properties
          </h2>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {results.map((result, index) => {
            const Icon = result.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-light">
                      {result.location}
                    </p>
                    <p className="text-3xl font-medium text-gray-900">
                      {result.metric}
                    </p>
                    <p className="text-sm text-gray-600 font-light">
                      {result.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 font-light italic max-w-2xl mx-auto">
            Actual results vary by property, but we consistently outperform traditional rental models.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;