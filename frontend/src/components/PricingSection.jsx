import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, MapPin, User, Phone, Mail } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PricingSection = () => {
  const [countryCode, setCountryCode] = useState('+47');
  const [formData, setFormData] = useState({
    address: '',
    name: '',
    phone: '',
    email: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const countryCodes = [
    { code: '+47', country: 'Norge', flag: '🇳🇴' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+49', country: 'Tyskland', flag: '🇩🇪' },
    { code: '+33', country: 'Frankrike', flag: '🇫🇷' },
    { code: '+34', country: 'Spania', flag: '🇪🇸' },
    { code: '+31', country: 'Nederland', flag: '🇳🇱' },
    { code: '+46', country: 'Sverige', flag: '🇸🇪' },
    { code: '+45', country: 'Danmark', flag: '🇩🇰' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
  ];

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const leadData = {
        ...formData,
        phone: `${countryCode} ${formData.phone}`,
      };
      await axios.post(`${API}/leads`, leadData);
      setSuccess(true);
      setFormData({ address: '', name: '', phone: '', email: '' });
      setCountryCode('+47');
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Noe gikk galt. Vennligst prøv igjen.');
    }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
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
              <p className="text-lg text-gray-600">
                av leieinntekt + MVA
              </p>
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

          <div className="border-t-2 border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">
              Kom i gang i dag
            </h3>

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm text-center">
                Takk! Vi kontakter deg snart.
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={handleChange('address')}
                    placeholder="Eiendomsadresse"
                    className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-white"
                    required
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange('name')}
                    placeholder="Ditt navn"
                    className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 pl-2 pr-1 py-3 text-xs border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-white"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      placeholder="Telefonnummer"
                      className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="E-postadresse"
                    className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-md"
              >
                Få gratis estimat
              </button>
            </form>
          </div>
        </div>

        <div className="text-center">
          <Link 
            to="/investors"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <span>Investeringspartner? Store eiendomsaktører kan søke om skreddersydd tilbud</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;