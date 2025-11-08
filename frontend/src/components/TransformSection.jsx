import React from 'react';
import { Hand, Clock, Brain } from 'lucide-react';

const TransformSection = () => {
  const features = [
    {
      icon: Hand,
      title: 'Helping Hand',
      description: 'Provides assistance with everyday tasks',
    },
    {
      icon: Clock,
      title: 'Reclaim Time',
      description: 'Automates household chores, freeing time for priorities',
    },
    {
      icon: Brain,
      title: 'Helpful Intelligence',
      description: 'Brings useful insight into every conversation',
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tight">
            Transform Your Home
          </h2>
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            NEO takes on the boring and mundane tasks around the house so you
            can focus on what matters to you.
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="aspect-video w-full flex items-center justify-center relative group">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/90 to-gray-900/90 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-10 h-10 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-white/80 text-sm font-light">Watch Demo Video</p>
              </div>
            </div>
            {/* Thumbnail */}
            <img
              src="https://cdn.sanity.io/images/qka6yvsc/production/ee557c733ef09cd4628692339331fa5abc79239b-1069x2293.webp?q=100&fit=max&auto=format"
              alt="NEO Demo"
              className="w-full h-full object-cover opacity-30"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group text-center space-y-4 p-8 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-xl"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl group-hover:bg-gray-900 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <button className="group px-10 py-4 bg-gray-900 text-white rounded-full text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
            <span className="flex items-center space-x-2">
              <span>Watch Keynote</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TransformSection;
