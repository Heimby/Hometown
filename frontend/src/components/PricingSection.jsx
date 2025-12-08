import React, { useRef } from "react";
import { CheckCircle } from "lucide-react";

const PricingSection = () => {
  const sectionRef = useRef(null);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6"
      style={{ backgroundColor: "#F9F8F4" }}
    >
      <div className="max-w-4xl mx-auto">
        <>
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Enkel, transparent prising
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Ingen skjulte kostnader. Du betaler kun når du tjener.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 sm:p-10 md:p-12 border-2 border-gray-200 mb-6">
            <div className="text-center mb-6">
              <div className="inline-block px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full mb-4">
                Standardpris
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold text-gray-900">
                  15%
                </div>
                <p className="text-lg text-gray-600">av leieinntekt + MVA</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                <p className="text-base text-gray-700">
                  Alle direkte driftskostnader trekkes fra utbetaling
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                <p className="text-base text-gray-700">
                  Full eiendomsforvaltning inkludert
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                <p className="text-base text-gray-700">
                  Ingen forhåndskostnader eller abonnementsavgifter
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center mb-8">
              Du betaler kun når eiendommen genererer inntekt
            </p>
          </div>
        </>
      </div>
    </section>
  );
};

export default PricingSection;
