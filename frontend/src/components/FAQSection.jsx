import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";

const FAQSection = ({ faqs, cityName }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Generate Schema.org FAQ structured data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="py-16 px-6" style={{ backgroundColor: "#F9F8F4" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Ofte stilte spørsmål
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Få svar på de vanligste spørsmålene om korttidsutleie i {cityName}
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(index)}
                  className="w-full flex items-start justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  {expandedIndex === index ? (
                    <Minus className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
                  ) : (
                    <Plus className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
                  )}
                </button>
                {expandedIndex === index && (
                  <div className="px-6 pb-6 text-base text-gray-700 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
