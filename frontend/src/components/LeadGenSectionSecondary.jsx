import React, { useState } from 'react';
import { MapPin, User, Phone, Mail } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LeadGenSectionSecondary = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countryCode, setCountryCode] = useState('+47');
  const [formData, setFormData] = useState({
    address: '',
    name: '',
    phone: '',
    email: '',
  });

  const countryCodes = [
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
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
    
    try {
      const leadData = {
        ...formData,
        phone: `${countryCode} ${formData.phone}`,
      };
      await axios.post(`${API}/leads`, leadData);
      setSuccess(true);
      setFormData({ address: '', name: '', phone: '', email: '' });
      setCountryCode('+47');
      setIsExpanded(false);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error creating lead:', err);
      setError('Failed to submit. Please try again.');
    }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight px-2">
            Klar til å maksimere leieinntektene dine?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto px-4">
            Finn ut hvor mye du kan tjene med DigiHome
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm text-center">
              Thank you! We will contact you shortly.
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
            {/* Address Field */}
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
                  placeholder="Enter your property address"
                  className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Expanded Fields */}
            {isExpanded && (
              <>
                <div className="relative animate-fade-in">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleChange('name')}
                      placeholder="Your name"
                      className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="relative animate-fade-in">
                  <div className="relative flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-32 pl-3 pr-2 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-300"
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
                        placeholder="Phone number"
                        className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="relative animate-fade-in">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2 animate-fade-in">
                  <button
                    type="submit"
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Get Your Free Estimate
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Helper text */}
          {!isExpanded && (
            <p className="text-center text-sm text-gray-500 mt-4 animate-fade-in">
              Start typing to see your potential earnings
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default LeadGenSectionSecondary;
