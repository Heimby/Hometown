import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://cdn.sanity.io/images/qka6yvsc/production/c1a93f30beb4c513da832bcd886db94419e06be2-4096x2731.webp?q=100&fit=max&auto=format"
          alt="NEO Robot"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-tight">
              Let go of your rental headaches
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light tracking-wide max-w-3xl mx-auto">
              DigiHome delivers data-driven property management with human service
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button className="group relative px-8 py-3 bg-white text-black rounded-full text-base font-medium transition-all duration-300 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
              <span className="relative z-10">Get started</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
