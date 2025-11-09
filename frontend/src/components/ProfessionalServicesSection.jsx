import React, { useState } from 'react';
import { Sparkles, Wrench, Package, Shield, Users, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const ProfessionalServicesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    {
      icon: Sparkles,
      title: 'Certified Cleaners',
      description: 'Professionally trained, quality-controlled cleaners deliver consistent hotel-grade standards. Every clean is logged, photographed, and verified in our system for full transparency.',
    },
    {
      icon: Wrench,
      title: 'Maintenance & Technical Services',
      description: 'Licensed technicians handle everything from routine repairs to emergency callouts. Preventive maintenance schedules ensure properties stay in top condition and minimize downtime.',
    },
    {
      icon: Package,
      title: 'Consumables & Supply Management',
      description: 'Automated stock tracking and locally sourced suppliers keep every unit fully equipped with essentials. Owners never overpay and guests never run out.',
    },
    {
      icon: Shield,
      title: 'Security & Safety Services',
      description: 'Integrated smart-lock systems, compliance checks, and safety inspections protect both your property and occupants. We partner with local security providers for rapid on-site response when needed.',
    },
    {
      icon: Users,
      title: 'Local Specialists in Every Market',
      description: 'From inspectors to photographers to linen suppliers, every partner is carefully vetted and continuously evaluated to maintain DigiHome's national standard.',
    },
    {
      icon: MessageSquare,
      title: '24/7 Communication & Analytics',
      description: '24/7 communication, investment & pricing analysts ensure your property performs optimally with data-driven insights and constant support.',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const visibleCards = 3;
  const getVisibleServices = () => {
    const visible = [];
    for (let i = 0; i < visibleCards; i++) {
      visible.push(services[(currentIndex + i) % services.length]);
    }
    return visible;
  };

  return (
    <section className="relative py-24 px-6 bg-gray-50">
      <div className="mx-auto" style={{ maxWidth: '95%' }}>
        {/* Heading */}
        <div className="text-center mb-12 space-y-4 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            The DigiHome Ecosystem
          </h2>
          <p className="text-xl text-gray-700 font-light">
            A fully integrated network of local professionals powering reliable property performance
          </p>
          <p className="text-base text-gray-600 font-light leading-relaxed pt-4">
            The DigiHome Ecosystem is built to ensure every property receives the highest standard of care, 
            no matter the city. We integrate certified service partners, digital monitoring, and local teams 
            into one seamless operational engine.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mt-16">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          {/* Cards Container - Desktop */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 px-8">
            {getVisibleServices().map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  style={{ aspectRatio: '9/16' }}
                >
                  <div className="p-8 h-full flex flex-col">
                    <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed font-light flex-1">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cards Container - Mobile (single card) */}
          <div className="md:hidden px-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden ${
                    index === currentIndex ? 'block' : 'hidden'
                  }`}
                  style={{ aspectRatio: '9/16' }}
                >
                  <div className="p-8 h-full flex flex-col">
                    <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed font-light flex-1">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-gray-900 w-8' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalServicesSection;
