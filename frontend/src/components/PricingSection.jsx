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
      console.error('Error creating lead:', err);
      setError('Failed to submit. Please try again.');
    }
  };

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
