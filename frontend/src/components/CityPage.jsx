import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useLocation, useParams } from "react-router-dom";
import cityData from "../data/cityData.json";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import LeadGenSection from "./LeadGenSection";
import Navbar from "./Navbar";
import ProfessionalServicesSection from "./ProfessionalServicesSection";
import WhatWeAreSection from "./WhatWeAreSection";

const CityPage = () => {
  const { city } = useParams();
  const location = useLocation();

  // Extract city slug from URL if not in params
  const citySlug =
    city || location.pathname.split("/korttidsutleie-i-")[1]?.split("/")[0];
  const data = cityData[citySlug];

  useEffect(() => {
    if (data) {
      document.title = data.title;
      window.scrollTo(0, 0);
    }
  }, [data]);

  // If city doesn't exist, redirect to home
  if (!data) {
    return <Navigate to="/" replace />;
  }

  // Schema.org structured data for local business
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Heimby - Korttidsutleie i ${data.name}`,
    description: data.metaDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: data.name,
      addressCountry: "NO",
    },
    areaServed: {
      "@type": "City",
      name: data.name,
    },
    serviceType: "Eiendomsforvaltning og korttidsutleie",
    priceRange: "15% av leieinntekter",
  };

  return (
    <>
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.metaDescription} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href={`https://heimby.no/korttidsutleie-i-${data.slug}`}
        />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      <div className="App">
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://customer-assets.emergentagent.com/job_homeeasy-app/artifacts/o346zaa7_create_a_mix_of_no_image%20%281%29.jpeg)",
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative z-10 text-center px-6 py-20 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {data.heroTitle}
            </h1>
            <p className="text-2xl md:text-3xl text-white/95 font-light mb-6">
              {data.heroSubtitle}
            </p>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {data.heroDescription}
            </p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 px-6" style={{ backgroundColor: "#FFFFFF" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
              {data.introSection.title}
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              {data.introSection.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Benefits */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg"
                >
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-base text-gray-800">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Generation Section */}
        <div id="lead-gen">
          <LeadGenSection />
        </div>

        {/* How It Works Section */}
        <WhatWeAreSection />

        {/* Professional Services Section */}
        <ProfessionalServicesSection />

        {/* FAQ Section */}
        <FAQSection faqs={data.faqs} cityName={data.name} />

        {/* CTA Section */}
        <section className="py-20 px-6" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Klar til å maksimere inntektene fra boligen din i {data.name}?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Få en gratis vurdering av din eiendom og se hvor mye du kan tjene
            </p>
            <a
              href="#lead-gen"
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Få gratis vurdering
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CityPage;
