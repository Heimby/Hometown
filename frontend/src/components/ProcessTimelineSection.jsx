import React, { useEffect, useRef, useState } from 'react';
import { FileText, Image, Settings, Key, ChevronRight } from 'lucide-react';

const ProcessTimelineSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const progress = ((scrollPosition - sectionTop) / sectionHeight) * 100;
        setScrollProgress(Math.min(Math.max(progress, 0), 100));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      icon: FileText,
      title: 'Automatisk analyse',
      description: 'Vi analyserer din bolig og gir deg umiddelbart innsikt i inntektspotensial og beste utleiestrategi.',
    },
    {
      icon: Image,
      title: 'Kort veiledningssamtale (hvis du trenger)',
      description: 'Et raskt møte hvor vi forklarer hvordan alt fungerer og svarer på spørsmål du måtte ha.',
    },
    {
      icon: Settings,
      title: 'Digital oppstart',
      description: 'Vi setter opp alle systemer, annonser og bilder slik at alt er klart for første gjest.',
    },
    {
      icon: Key,
      title: 'Nøkler levert og du kan lene deg tilbake',
      description: 'Alt er på plass. Du trenger bare å levere nøklene, så tar vi oss av resten.',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6" 
      style={{ backgroundColor: '#F9F8F4' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-start">
            <div className="mb-4">
              <div className="text-sm font-semibold uppercase tracking-wider text-gray-600">
                Prosess
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Sett i gang raskt og enkelt
            </h2>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Start
              </button>
              <button className="flex items-center gap-2 text-gray-900 font-medium hover:opacity-70 transition-opacity">
                <span>Mer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Content - Timeline */}
          <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            {/* Animated Progress Bar */}
            <div 
              className="absolute left-6 top-0 w-0.5 bg-gray-900 transition-all duration-300 ease-out"
              style={{ height: `${scrollProgress}%` }}
            ></div>

            {/* Timeline Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative flex gap-6">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white z-10 relative">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimelineSection;
