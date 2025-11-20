import React, { useState, useRef, useEffect } from 'react';
import { MapPin, User, Phone, Mail, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LeadGenSection = () => {
  const [step, setStep] = useState(1); // 1: form, 2: loading, 3: success
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('+47');
  const [formData, setFormData] = useState({
    address: '',
    name: '',
    phone: '',
    email: '',
  });
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

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const leadData = {
        address: formData.address,
        name: formData.name,
        phone: `${countryCode} ${formData.phone}`,
        email: formData.email,
      };
      
      const response = await axios.post(`${API}/leads`, leadData);
      
      // Go directly to creating owner portal (skip password step)
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
        password: 'temp_password_' + Date.now(), // Generate temporary password for magic link
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
        id: response.data.id,
        address: formData.address,
        property_address: formData.address,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
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
    <section ref={sectionRef} className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="max-w-6xl mx-auto">
        {step === 1 ? (
          <>
            <div className="bg-gray-50 rounded-3xl p-8 sm:p-10 md:p-12 shadow-lg border border-gray-200 max-w-5xl mx-auto">
              <div className="text-center mb-8 sm:mb-10 space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-600 tracking-tight">
                  Eneste som tilbyr både
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2 text-base sm:text-lg text-gray-500">
                  <span>Airbnb og langtidsutleie</span>
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-semibold pt-2 sm:pt-4">
                  Sjekk hvor mye du kan tjene med oss
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="relative">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div
                className={`grid gap-4 transition-all duration-500 ease-in-out ${
                  isExpanded
                    ? 'grid-cols-1 md:grid-cols-2 opacity-100'
                    : 'grid-cols-1 opacity-100'
                }`}
                style={{
                  maxHeight: isExpanded ? '500px' : '80px',
                }}
              >
                <div
                  className={`relative ${
                    isExpanded ? 'md:col-span-2' : 'col-span-1'
                  }`}
                >
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={handleAddressChange}
                      placeholder="Skriv inn adressen din"
                      style={{ backgroundColor: '#FFFFFF' }}
                      className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
                      required
                    />
                  </div>
                </div>

                {isExpanded && (
                  <>
                    <div className="relative animate-fade-in">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={handleChange('name')}
                          placeholder="Ditt navn"
                          style={{ backgroundColor: '#FFFFFF' }}
                          className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative animate-fade-in">
                      <div className="relative flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          style={{ backgroundColor: '#FFFFFF' }}
                          className="w-32 pl-3 pr-2 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
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
                            style={{ backgroundColor: '#FFFFFF' }}
                            className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative animate-fade-in md:col-span-2">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={handleChange('email')}
                          placeholder="E-postadresse"
                          style={{ backgroundColor: '#FFFFFF' }}
                          className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 animate-fade-in">
                      <button
                        type="submit"
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Beregn mine inntekter
                      </button>
                    </div>
                  </>
                )}
              </div>

              {!isExpanded && (
                <p className="text-center text-sm text-gray-500 mt-4 animate-fade-in">
                  Begynn å skrive for å se dine potensielle inntekter
                </p>
              )}
              </form>
            </div>
          </>
        ) : step === 2 ? (
          <>
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

export default LeadGenSection;