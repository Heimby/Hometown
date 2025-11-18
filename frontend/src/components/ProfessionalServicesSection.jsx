import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProfessionalServicesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    {
      title: 'Sertifiserte renholdere',
      description: 'Profesjonelt trente, kvalitetskontrollerte renholdere leverer konsistente hotellstandarder. Hver rengjøring logges, fotograferes og verifiseres i systemet vårt for full transparens.',
      image: 'https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/vh2we7fs_a_candid_lifestyle_image%20%281%29.jpeg',
    },
    {
      title: 'Vedlikehold & Tekniske tjenester',
      description: 'Lisensierte teknikere håndterer alt fra rutinereperasjoner til nødutrykkinger. Forebyggende vedlikeholdsplaner sikrer at eiendommene holder toppstandard og minimerer nedetid.',
      image: 'https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/i4c1bl7s_a_candid_lifestyle_image.jpeg',
    },
    {
      title: 'Forbruksvarer & Lagerstyring',
      description: 'Automatisert lagersporing og lokale leverandører holder hver enhet fullt utstyrt med det nødvendige. Eiere betaler aldri for mye og gjester går aldri tom.',
      image: 'https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/lmyvu6xn_a_candid_lifestyle_image%20%282%29.jpeg',
    },
    {
      title: 'Sengetøy & Vaskerilogistikk',
      description: 'Glem bryet med å vaske og brette. Vi håndterer rotasjon av sengetøy og håndklær med høy trådtetthet, ved bruk av profesjonell vaskeriservice utenfor stedet for å sikre hotellstandard hygiene.',
      image: 'https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/6z1bkvn0_a_candid_lifestyle_image%20%284%29.jpeg',
    },
    {
      title: 'Lokale spesialister i hvert marked',
      description: 'Fra inspektører til fotografer til sengetøyleverandører, hver partner er nøye vurdert og kontinuerlig evaluert for å opprettholde DigiHomes nasjonale standard.',
      image: 'https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/jh9h3rva_a_candid_waist_up_image.jpeg',
    },
    {
      title: '24/7 Kommunikasjon & Analyse',
      description: '24/7 kommunikasjon, investerings- og prisanalytikere sikrer at eiendommen din presterer optimalt med datadrevne innsikter og konstant støtte.',
      image: 'https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/eci7fzi0_a_candid_lifestyle_image%20%283%29.jpeg',
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

