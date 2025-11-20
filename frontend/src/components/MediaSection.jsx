import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const MediaSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const mediaArticles = [
    {
      title: 'Ny norsk AI-aktør vil revolusjonere eiendom',
      description: 'DigiHome får oppmerksomhet i Estatenyheter for sin innovative tilnærming til eiendomsforvaltning med kunstig intelligens.',
      image: 'https://customer-assets.emergentagent.com/job_property-onboard-1/artifacts/qcxh4qha_image.png',
      source: 'Estatenyheter',
      url: 'https://www.estatenyheter.no/bergen-vest/ny-norsk-ai-aktor-vil-revolusjonere-eiendom/479002'
    },
    {
      title: 'GuestyVal Mexico | Machine Earning: 10 AI Tactics Powering STR Profits',
      description: 'DigiHome & EnsoConnect presenterer på GuestyVal Mexico om AI-drevet profittoptimalisering for korttidsutleie.',
      image: 'https://customer-assets.emergentagent.com/job_property-onboard-1/artifacts/7tafy6d7_image.png',
      source: 'GuestyVal Mexico',
      url: 'https://www.youtube.com/watch?v=sT6i93KG8h0'
    },
    {
      title: 'Fra storbank til startup',
      description: 'Shifter skriver om hvordan DigiHome skal bygge skalerbare selskaper i tungrodd bransje.',
      image: 'https://customer-assets.emergentagent.com/job_property-onboard-1/artifacts/li1mznsy_image.png',
      source: 'Shifter',
      url: 'https://www.shifter.no/nyheter/fra-storbank-til-startup-skal-bygge-skalerbare-selskaper-i-tungrodde-bransjer/413476'
    },
    {
      title: 'DigiSale-gruppen lanserer plattform for bilsalg og utleie av eiendom',
      description: 'Firdaposten om grunnleggeren bak DigiHome og hans visjon for AI i eiendomsbransjen.',
      image: 'https://customer-assets.emergentagent.com/job_property-onboard-1/artifacts/vtbnhq20_image.png',
      source: 'Firdaposten',
      url: 'https://www.firdaposten.no/njal-26-vil-selge-bilen-din-med-hjelp-av-ai/s/5-16-924719'
    },
    {
      title: 'Njål (25) er blitt stor på utleigeforvalting',
      description: 'Firdaposten skriver om vekstreisen til DigiHome og hvordan de revolusjonerer utleieforvaltning.',
      image: 'https://customer-assets.emergentagent.com/job_property-onboard-1/artifacts/yie0f2k1_image.png',
      source: 'Firdaposten',
      url: 'https://www.firdaposten.no/njal-25-fra-floro-er-blitt-stor-pa-utleigeforvalting-eg-jobbar-fulltid-pa-fritida/s/5-16-852639'
    },
    {
      title: 'Studenter må flytte ut om sommeren',
      description: 'NRK Vestland rapporterer om Airbnb-ifisering av utleiemarkedet og DigiHomes rolle.',
      image: 'https://customer-assets.emergentagent.com/job_property-onboard-1/artifacts/7kb7sk85_image.png',
      source: 'NRK Vestland',
      url: 'https://www.nrk.no/vestland/studenter-ma-flytte-ut-om-sommeren-_-advarer-mot-_airbnb-ifisering_-av-utleiemarkedet-1.17437819'
    },
    {
      title: 'Her får du ikke lov til å bo om sommeren',
      description: 'TV2 dekker hvordan korttidsutleie påvirker boligmarkedet i Norge.',
      image: 'https://customer-assets.emergentagent.com/job_property-onboard-1/artifacts/92oj9f0r_image.png',
      source: 'TV2',
      url: 'https://www.tv2.no/nyheter/innenriks/her-far-du-ikke-lov-til-a-bo-om-sommeren/17777568/'
    },
    {
      title: 'Startup-podden med Njål Eliasson',
      description: 'Spotify-podcast om grunnleggeren av DigiHome og hans reise i startup-verden.',
      image: 'https://customer-assets.emergentagent.com/job_property-onboard-1/artifacts/rcwr411d_image.png',
      source: 'Spotify',
      url: 'https://open.spotify.com/episode/7GcqJMfBqogJvAZa4eRqUJ'
    },
    {
      title: 'Utleieaktører satser i Stavanger',
      description: 'RA Stavanger om hvordan DigiHome ekspanderer til nye markeder i Norge.',
      image: 'https://customer-assets.emergentagent.com/job_property-onboard-1/artifacts/qulqoemu_image.png',
      source: 'RA Stavanger',
      url: 'https://www.rastavanger.no/utleieaktorer-satser-i-stavanger/s/5-165-48584'
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaArticles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaArticles.length) % mediaArticles.length);
  };

  const visibleCards = 4;
  const getVisibleArticles = () => {
    const visible = [];
    for (let i = 0; i < visibleCards; i++) {
      visible.push(mediaArticles[(currentIndex + i) % mediaArticles.length]);
    }
    return visible;
  };

  return (
    <section className="relative py-24 px-6" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="mx-auto" style={{ maxWidth: '95%' }}>
        {/* Heading */}
        <div className="text-center mb-12 space-y-4 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
            DigiHome i media
          </h2>
          <p className="text-xl text-gray-700 font-light">
            Oppmerksomhet i ledende medier for innovasjon innen eiendomsforvaltning
          </p>
          <p className="text-base text-gray-600 font-light leading-relaxed pt-4">
            DigiHome får anerkjennelse i både lokale og nasjonale medier for vår innovative tilnærming 
            til eiendomsforvaltning. Fra AI-drevet teknologi til profesjonell service – vi setter nye 
            standarder i bransjen. Les hva mediene skriver om oss og vår reise mot å revolusjonere 
            utleiemarkedet i Norge.
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
            {getVisibleArticles().map((article, index) => {
              return (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  style={{ aspectRatio: '3/4' }}
                >
                  {/* Background Image */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* External Link Icon */}
                  <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink className="w-4 h-4 text-gray-900" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-5">
                    <div className="text-xs text-white/70 font-medium mb-1">
                      {article.source}
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-white/90 leading-relaxed font-light line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Cards Container - Mobile (single card) */}
          <div className="md:hidden px-8">
            {mediaArticles.map((article, index) => {
              return (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative shadow-lg transition-all duration-300 overflow-hidden ${
                    index === currentIndex ? 'block' : 'hidden'
                  }`}
                  style={{ aspectRatio: '3/4' }}
                >
                  {/* Background Image */}
                  <img
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* External Link Icon */}
                  <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2">
                    <ExternalLink className="w-4 h-4 text-gray-900" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-5">
                    <div className="text-xs text-white/70 font-medium mb-1">
                      {article.source}
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-white/90 leading-relaxed font-light line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {mediaArticles.map((_, index) => (
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

export default MediaSection;
