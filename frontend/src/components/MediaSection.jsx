import React from 'react';
import { ExternalLink, Newspaper, Podcast } from 'lucide-react';

const MediaSection = () => {
  const mediaItems = [
    {
      title: "Ny norsk AI-aktør vil revolusjonere eiendom",
      source: "Estatenyheter",
      url: "https://www.estatenyheter.no/bergen-vest/ny-norsk-ai-aktor-vil-revolusjonere-eiendom/479002",
      type: "article"
    },
    {
      title: "Fra storbank til startup",
      source: "Shifter",
      url: "https://www.shifter.no/nyheter/fra-storbank-til-startup-skal-bygge-skalerbare-selskaper-i-tungrodde-bransjer/413476",
      type: "article"
    },
    {
      title: "Njål (26) vil selge bilen din med hjelp av AI",
      source: "Firdaposten",
      url: "https://www.firdaposten.no/njal-26-vil-selge-bilen-din-med-hjelp-av-ai/s/5-16-924719",
      type: "article"
    },
    {
      title: "Njål (25) fra Florø er blitt stor på utleigeforvalting",
      source: "Firdaposten",
      url: "https://www.firdaposten.no/njal-25-fra-floro-er-blitt-stor-pa-utleigeforvalting-eg-jobbar-fulltid-pa-fritida/s/5-16-852639",
      type: "article"
    },
    {
      title: "Studenter må flytte ut om sommeren",
      source: "NRK Vestland",
      url: "https://www.nrk.no/vestland/studenter-ma-flytte-ut-om-sommeren-_-advarer-mot-_airbnb-ifisering_-av-utleiemarkedet-1.17437819",
      type: "article"
    },
    {
      title: "Her får du ikke lov til å bo om sommeren",
      source: "TV2",
      url: "https://www.tv2.no/nyheter/innenriks/her-far-du-ikke-lov-til-a-bo-om-sommeren/17777568/",
      type: "article"
    },
    {
      title: "Startup-podden med Njål E. Liasson",
      source: "Spotify",
      url: "https://open.spotify.com/episode/7GcqJMfBqogJvAZa4eRqUJ",
      type: "podcast"
    },
    {
      title: "Utleieaktører satser i Stavanger",
      source: "Råstavanger",
      url: "https://www.rastavanger.no/utleieaktorer-satser-i-stavanger/s/5-165-48584",
      type: "article"
    }
  ];

  return (
    <section className="relative py-0 px-0 sm:px-6" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="relative min-h-[600px] mx-auto" style={{ maxWidth: '100%' }}>
        <img
          src="https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/o346zaa7_create_a_mix_of_no_image%20%281%29.jpeg"
          alt="DigiHome Media Coverage"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-6xl mx-auto py-16 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-6" style={{ backgroundColor: '#ededed' }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                DigiHome i media
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Vi får oppmerksomhet i både lokale og nasjonale medier for vår innovative tilnærming til eiendomsforvaltning.
              </p>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {mediaItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {item.type === 'podcast' ? (
                        <Podcast className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Newspaper className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.source}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>

              <p className="text-base text-gray-600 font-light italic mt-4">
                Oppmerksomhet i ledende medier. Anerkjent for innovasjon.
              </p>
            </div>

            <div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
