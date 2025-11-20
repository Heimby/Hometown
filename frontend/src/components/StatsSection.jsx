import React from 'react';
import { Users, DollarSign, Home, TrendingUp } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      number: "36 000+",
      label: "Fornøyde gjester",
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      description: "Gjester fra hele verden"
    },
    {
      number: "29M+",
      label: "NOK utbetalt",
      icon: <DollarSign className="w-8 h-8 text-emerald-600" />,
      description: "Til våre eiere"
    },
    {
      number: "150+",
      label: "Eiendommer",
      icon: <Home className="w-8 h-8 text-emerald-600" />,
      description: "Under forvaltning"
    },
    {
      number: "98%",
      label: "Belæggsgrad",
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      description: "Gjennom hele året"
    }
  ];

  return (
    <section className="relative py-0" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left side - Image */}
          <div className="relative min-h-[500px] lg:min-h-[600px]">
            <img
              src="https://customer-assets.emergentagent.com/job_rental-wizard-7/artifacts/q9gpcyuj_Remove_the_text_on_the_right_hand_side_image_1.png"
              alt="DigiHome Properties"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Right side - Stats */}
          <div className="flex items-center justify-center p-8 md:p-16" style={{ backgroundColor: '#F9F8F4' }}>
            <div className="max-w-lg w-full">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Resultater som teller
                </h2>
                <p className="text-lg text-gray-600">
                  Vi har hjulpet hundrevis av eiere med å maksimere avkastningen på eiendommene deres.
                </p>
              </div>

              <div className="space-y-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex-shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-sm text-emerald-800 font-medium">
                  "DigiHome har transformert hvordan jeg tenker på utleie. Resultatet har oversteget alle forventninger."
                </p>
                <p className="text-xs text-emerald-600 mt-2">
                  - Eier fra Bergen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
