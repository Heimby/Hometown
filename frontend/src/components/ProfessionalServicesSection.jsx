import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProfessionalServicesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    {
      title: 'Certified Cleaners',
      description: 'Professionally trained, quality-controlled cleaners deliver consistent hotel-grade standards. Every clean is logged, photographed, and verified in our system for full transparency.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Maintenance & Technical Services',
      description: 'Licensed technicians handle everything from routine repairs to emergency callouts. Preventive maintenance schedules ensure properties stay in top condition and minimize downtime.',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Consumables & Supply Management',
      description: 'Automated stock tracking and locally sourced suppliers keep every unit fully equipped with essentials. Owners never overpay and guests never run out.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Security & Safety Services',
      description: 'Integrated smart-lock systems, compliance checks, and safety inspections protect both your property and occupants. We partner with local security providers for rapid on-site response when needed.',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Local Specialists in Every Market',
      description: 'From inspectors to photographers to linen suppliers, every partner is carefully vetted and continuously evaluated to maintain DigiHome\'s national standard.',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: '24/7 Communication & Analytics',
      description: '24/7 communication, investment & pricing analysts ensure your property performs optimally with data-driven insights and constant support.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const visibleCards = 4;
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
            The DigiHome Ecosystem ensures every property receives the highest standard of care, in every city. 
            We combine certified service partners, digital monitoring, and local on-the-ground teams into one 
            seamless operational engine. Our vision is simple: accessing professional property services should 
            feel as effortless as ordering an Uber.
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
          <div className="hidden md:grid md:grid-cols-4 gap-4 px-8">
            {getVisibleServices().map((service, index) => {
              return (
                <div
                  key={index}
                  className="relative shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  style={{ aspectRatio: '3/4' }}
                >
                  {/* Background Image */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-5">
                    <h3 className="text-lg font-medium text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-white/90 leading-relaxed font-light line-clamp-3">
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
              return (
                <div
                  key={index}
                  className={`relative shadow-lg transition-all duration-300 overflow-hidden ${
                    index === currentIndex ? 'block' : 'hidden'
                  }`}
                  style={{ aspectRatio: '3/4' }}
                >
                  {/* Background Image */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-5">
                    <h3 className="text-lg font-medium text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-white/90 leading-relaxed font-light line-clamp-3">
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

