import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const PricingSection = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            No hidden fees. Pay only when you earn.
          </p>
        </div>

        {/* Standard Rate Card */}
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-10 md:p-12 border-2 border-gray-200 mb-6">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full mb-4">
              Standard Rate
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-bold text-gray-900">
                15%
              </div>
              <p className="text-lg text-gray-600">
                of rental income + VAT
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
              <p className="text-base text-gray-700">
                All direct operational costs are deducted from payout
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
              <p className="text-base text-gray-700">
                Full property management included
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
              <p className="text-base text-gray-700">
                No upfront costs or subscription fees
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Only pay when your property generates income
          </p>
        </div>

        {/* Investment Partner Link - Subtle */}
        <div className="text-center">
          <Link 
            to="/investors"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <span>Investment partner? Bigger property players can apply for a tailored offer</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
