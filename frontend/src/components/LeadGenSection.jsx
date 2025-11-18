import React, { useState } from 'react';
import { MapPin, User, Phone, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LeadGenSection = () => {
  const [step, setStep] = useState(1); // 1: lead form, 2: owner portal, 3: loading, 4: success
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('+47');
  const [formData, setFormData] = useState({
    address: '',
    name: '',
    phone: '',
    email: '',
    password: '',
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

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Submit lead data to backend with country code
      const leadData = {
        address: formData.address,
        name: formData.name,
        phone: `${countryCode} ${formData.phone}`,
        email: formData.email,
      };
      
      const response = await axios.post(`${API}/leads`, leadData);
      console.log('Lead created:', response.data);
      
      // Transition to owner portal step
      setTimeout(() => {
        setStep(2);
      }, 300);
    } catch (err) {
      console.error('Error creating lead:', err);
      setError('Failed to submit. Please try again.');
    }
  };

  const handleOwnerPortalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Show loading
    setStep(3);
    
    try {
      // Create owner portal account with country code
      const ownerData = {
        address: formData.address,
        name: formData.name,
        phone: `${countryCode} ${formData.phone}`,
        email: formData.email,
        password: formData.password,
      };
      
      const response = await axios.post(`${API}/owner-portal`, ownerData, {
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Only accept 2xx status codes
        }
      });
      
      console.log('Owner portal created:', response.data);
      
      // Check if response has the expected structure
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from server');
      }
      
      // Save property data to localStorage
      localStorage.setItem('ownerProperty', JSON.stringify({
        address: formData.address,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ownerId: response.data.id,
      }));
      
      // After 1.5 seconds, show success
      setTimeout(() => {
        setStep(4);
      }, 1500);
    } catch (err) {
      console.error('Error creating owner portal:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to create owner portal. Please try again.');
      setStep(2); // Go back to form
    }
  };

  const handleGoToPortal = () => {
    // Redirect to owner portal dashboard
    window.location.href = '/owner-portal';
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {step === 1 ? (
          <>
            {/* Grey Box Container - Wrapping Everything */}
            <div className="bg-gray-50 rounded-3xl p-8 sm:p-10 md:p-12 shadow-lg border border-gray-200 max-w-5xl mx-auto">
              {/* Heading Section */}
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

              {/* Form */}
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
                      placeholder="Skriv inn adressen din"
                      className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400"
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
                          placeholder="Ditt navn"
                          className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative animate-fade-in">
                      <div className="relative flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-32 pl-3 pr-2 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400"
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
                            className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400"
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
                          className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-white hover:border-gray-400"
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

              {/* Helper text */}
              {!isExpanded && (
                <p className="text-center text-sm text-gray-500 mt-4 animate-fade-in">
                  Start typing to see your potential earnings
                </p>
              )}
              </form>
            </div>
          </>
        ) : step === 2 ? (
          <>
            {/* Step 2: Owner Portal Creation */}
            <div className="animate-fade-in">
              <div className="text-center mb-12 space-y-4">
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
                  Create Your Owner Portal
                </h2>
                <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                  We need a bit more information to accurately estimate your revenues.
                </p>
                <p className="text-base text-gray-500 font-light">
                  → Sign up for your owner portal to access detailed revenue estimates and property insights.
                </p>
              </div>

              <form onSubmit={handleOwnerPortalSubmit} className="max-w-xl mx-auto space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Create Your Owner Portal Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange('password')}
                      placeholder="Enter a strong password"
                      className="w-full pl-12 pr-12 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Create Owner Portal
                </button>

                {/* Summary of provided info */}
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl space-y-2">
                  <p className="text-sm font-medium text-gray-700">Your Information:</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Property:</span> {formData.address}</p>
                    <p><span className="font-medium">Name:</span> {formData.name}</p>
                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                    <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : step === 3 ? (
          <>
            {/* Step 3: Loading */}
            <div className="text-center py-16 animate-fade-in">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                </div>
                <p className="text-lg text-gray-600 font-light">
                  Creating your owner portal...
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Step 4: Success */}
            <div className="text-center py-8 animate-fade-in">
              <div className="flex flex-col items-center space-y-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
                    Owner portal created
                  </h2>
                  <p className="text-xl text-gray-600 font-light">
                    Your account is ready.
                  </p>
                </div>

                <button
                  onClick={handleGoToPortal}
                  className="px-10 py-4 bg-gray-900 text-white rounded-2xl text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Go to Owner Portal
                </button>

                <div className="mt-8 p-6 bg-gray-50 rounded-2xl max-w-md">
                  <p className="text-sm text-gray-600">
                    A confirmation email has been sent to <span className="font-medium">{formData.email}</span>
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
