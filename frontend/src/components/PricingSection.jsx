import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, MapPin, User, Phone, Mail } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PricingSection = () => {
  const [step, setStep] = useState(1); // 1: form, 2: loading, 3: success
  const [isExpanded, setIsExpanded] = useState(false);
  const [countryCode, setCountryCode] = useState('+47');
  const [formData, setFormData] = useState({
    address: '',
    name: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const sectionRef = useRef(null);

  // Scroll to center of section when step changes
  useEffect(() => {
    if (step === 2 || step === 3) {
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  }, [step]);

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

  const handleAddressChange = (e) => {
    setFormData({ ...formData, address: e.target.value });
    if (e.target.value && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Prevent scroll on mobile during transition
    const currentScrollPos = window.scrollY;
    
    try {
      const leadData = {
        address: formData.address,
        name: formData.name,
        phone: `${countryCode} ${formData.phone}`,
        email: formData.email,
      };
      
      const response = await axios.post(`${API}/leads`, leadData);
      
      // Maintain scroll position
      window.scrollTo(0, currentScrollPos);
      
      // Go directly to creating owner portal
      handleOwnerPortalCreation();
    } catch (err) {
      console.error('Lead submission error:', err);
      let errorMessage = 'Kunne ikke sende inn. Vennligst prøv igjen.';
      
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg).join(', ');
        } else if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleOwnerPortalCreation = async () => {
    setStep(2); // Show loading
    
    try {
      const ownerData = {
        address: formData.address,
        name: formData.name,
        phone: `${countryCode} ${formData.phone}`,
        email: formData.email,
        password: 'temp_password_' + Date.now(),
      };
      
      const response = await axios.post(`${API}/owner-portal`, ownerData, {
        validateStatus: function (status) {
          return status < 500; // Don't throw for 4xx errors
        }
      });
      
      // Check if user already exists
      if (response.status === 400) {
        window.location.href = '/login';
        return;
      }
      
      if (!response.data || !response.data.id) {
        throw new Error('Ugyldig svar fra serveren');
      }
      
      localStorage.setItem('ownerProperty', JSON.stringify({
        address: formData.address,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ownerId: response.data.id,
      }));
      
      setTimeout(() => {
        setStep(3);
      }, 1500);
    } catch (err) {
      console.error('Owner portal creation error:', err);
      let errorMessage = 'Kunne ikke opprette eierportal. Vennligst prøv igjen.';
      
      // Check if error is about existing user
      if (err.response && err.response.status === 400) {
        window.location.href = '/login';
        return;
      }
      
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg).join(', ');
        } else if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setStep(1);
    }
  };

  const handleGoToPortal = () => {
    window.location.href = '/owner-portal';
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="max-w-4xl mx-auto">
        {step === 1 ? (
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

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="relative">
                  <div
                    className={`grid gap-3 transition-all duration-500 ease-in-out ${
                      isExpanded
                        ? 'grid-cols-1 md:grid-cols-2 opacity-100'
                        : 'grid-cols-1 opacity-100'
                    }`}
                    style={{
                      maxHeight: isExpanded ? '500px' : '60px',
                    }}
                  >
                    {/* Address Field */}
                    <div
                      className={`relative ${
                        isExpanded ? 'md:col-span-2' : 'col-span-1'
                      }`}
                    >
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={handleAddressChange}
                        placeholder="Skriv inn adressen din"
                        style={{ backgroundColor: '#FFFFFF' }}
                        className="w-full pl-10 pr-3 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
                        required
                      />
                    </div>

                    {/* Expanded Fields */}
                    {isExpanded && (
                      <>
                        <div className="relative animate-fade-in">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={handleChange('name')}
                            placeholder="Ditt navn"
                            style={{ backgroundColor: '#FFFFFF' }}
                            className="w-full pl-10 pr-3 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
                            required
                          />
                        </div>

                        <div className="relative animate-fade-in">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            placeholder="E-postadresse"
                            style={{ backgroundColor: '#FFFFFF' }}
                            className="w-full pl-10 pr-3 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
                            required
                          />
                        </div>

                        <div className="relative animate-fade-in md:col-span-2">
                          <div className="flex gap-2">
                            <select
                              value={countryCode}
                              onChange={(e) => setCountryCode(e.target.value)}
                              style={{ backgroundColor: '#FFFFFF' }}
                              className="w-24 pl-2 pr-1 py-3 text-xs border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
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
                                style={{ backgroundColor: '#FFFFFF' }}
                                className="w-full pl-10 pr-3 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2 animate-fade-in">
                          <button
                            type="submit"
                            className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            Beregn mine inntekter
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {!isExpanded && (
                    <p className="text-center text-xs text-gray-500 mt-3 animate-fade-in">
                      Begynn å skrive for å se dine potensielle inntekter
                    </p>
                  )}
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
          </>
        ) : step === 2 ? (
          <>
            {/* Loading Screen */}
            <div className="text-center py-16 animate-fade-in">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                </div>
                <p className="text-lg text-gray-600 font-light">
                  Oppretter eierportalen din...
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success Screen */}
            <div className="text-center py-8 animate-fade-in">
              <div className="flex flex-col items-center space-y-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
                    Eierportal opprettet
                  </h2>
                  <p className="text-xl text-gray-600 font-light">
                    Kontoen din er klar.
                  </p>
                </div>

                <button
                  onClick={handleGoToPortal}
                  className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Gå til Eierportal
                </button>

                <div className="mt-8 p-6 bg-gray-50 rounded-2xl max-w-md">
                  <p className="text-sm text-gray-600">
                    En bekreftelsese-post har blitt sendt til <span className="font-medium">{formData.email}</span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PricingSection;