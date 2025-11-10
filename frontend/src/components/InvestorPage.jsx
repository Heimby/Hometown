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
        address: `${formData.company} - ${formData.properties} properties - ${formData.message}`,
      };
      
      await axios.post(`${API}/leads`, investorData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', properties: '', message: '' });
      setCountryCode('+47');
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting investor inquiry:', err);
      setError('Failed to submit. Please try again.');
    }
  };

  const benefits = [
    {
      icon: Building2,
      title: 'Portfolio Management',
      description: 'Specialized solutions for managing multiple properties across different markets',
    },
    {
      icon: Users,
      title: 'Dedicated Account Team',
      description: 'Personal account manager and priority support for your entire portfolio',
    },
    {
      icon: TrendingUp,
      title: 'Custom Pricing Structure',
      description: 'Tailored rates based on portfolio size, locations, and management needs',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <img 
              src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/ke4s6nwo_4633C819.svg"
              alt="DigiHome Logo"
              className="h-8"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Investment Partners & Large Portfolios
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Tailored property management solutions for institutional investors, real estate funds, and large portfolio owners
          </p>
        </div>
      </section>

      {/* Benefits Section */}
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

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Request a Tailored Offer
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Tell us about your portfolio and we'll create a custom proposal
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center">
              Thank you for your inquiry! Our investment team will contact you within 24 hours.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-200 shadow-sm">
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange('name')}
                    placeholder="John Smith"
                    className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="john@company.com"
                    className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
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
                      placeholder="Phone number"
                      className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={handleChange('company')}
                  placeholder="Company name"
                  className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                  required
                />
              </div>

              {/* Number of Properties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Properties *
                </label>
                <input
                  type="text"
                  value={formData.properties}
                  onChange={handleChange('properties')}
                  placeholder="e.g., 10 properties"
                  className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    value={formData.message}
                    onChange={handleChange('message')}
                    placeholder="Tell us about your portfolio, locations, and management needs..."
                    rows="4"
                    className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-all bg-gray-50 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gray-900 text-white rounded-xl text-base font-medium hover:bg-gray-800 transition-colors shadow-md"
              >
                Request Custom Proposal
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default InvestorPage;
