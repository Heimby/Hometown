import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Users, TrendingUp, Mail, User, Phone, MessageSquare } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const InvestorPage = () => {
  const [countryCode, setCountryCode] = useState('+47');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    properties: '',
    message: '',
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
      const investorData = {
        name: formData.name,
        email: formData.email,
        phone: `${countryCode} ${formData.phone}`,
        address: `${formData.company} - ${formData.properties} eiendommer - ${formData.message}`,
      };
      
      await axios.post(`${API}/leads`, investorData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', properties: '', message: '' });
      setCountryCode('+47');
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Kunne ikke sende inn. Vennligst prøv igjen.');
    }
  };

  const benefits = [
    {
      icon: Building2,
      title: 'Portefoljehåndtering',
      description: 'Spesialiserte løsninger for å administrere flere eiendommer på tvers av ulike markeder',
    },
    {
      icon: Users,
      title: 'Dedikert Kontoteam',
      description: 'Personlig kontoansvarlig og prioritert støtte for hele portefoljen din',
    },
    {
      icon: TrendingUp,
      title: 'Tilpasset Prisstruktur',
      description: 'Skreddersydde priser basert på portefoljestørrelse, lokasjoner og forvaltningsbehov',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Tilbake til Hjem</span>
            </Link>
            <img 
              src="/heimby-logo.svg"
              alt="Heimby Logo"
              className="h-8"
            />
          </div>
        </div>
      </header>

      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Investeringspartnere & Store Portefajer
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Skreddersydde løsninger for eiendomsforvaltning for institusjonelle investorer, eiendomsfond og store portefjeeiere
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-gray-50 p-6 sm:p-8 rounded-xl border border-gray-200">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Be om et Tilpasset Tilbud
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Fortell oss om portefoljen din, så lager vi et skreddersydd forslag
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
              Takk for din henvendelse! Vårt investeringsteam vil kontakte deg innen 24 timer.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-200 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fullt Navn *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange('name')}
                    placeholder="Ola Nordmann"
                    className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-postadresse *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="ola@firma.no"
                    className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefonnummer *
                </label>
                <div className="relative flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-32 pl-3 pr-2 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      placeholder="Telefonnummer"
                      className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selskap / Organisasjon *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={handleChange('company')}
                  placeholder="Firmanavn"
                  className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antall Eiendommer *
                </label>
                <input
                  type="text"
                  value={formData.properties}
                  onChange={handleChange('properties')}
                  placeholder="f.eks. 10 eiendommer"
                  className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tilleggsinformasjon
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.message}
                    onChange={handleChange('message')}
                    placeholder="Fortell oss om portefoljen din, lokasjoner og forvaltningsbehov..."
                    rows="4"
                    className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gray-900 text-white rounded-xl text-base font-medium hover:bg-gray-800 transition-colors shadow-md"
              >
                Be om Tilpasset Forslag
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default InvestorPage;