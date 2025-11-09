import React, { useState } from 'react';
import { MapPin, User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LeadGenSection = () => {
  const [step, setStep] = useState(1); // 1: lead form, 2: owner portal
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleAddressChange = (e) => {
    setFormData({ ...formData, address: e.target.value });
    if (e.target.value && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    console.log('Lead form submitted:', formData);
    // TODO: Send email notification here
    
    // Transition to owner portal step
    setTimeout(() => {
      setStep(2);
    }, 300);
  };

  const handleOwnerPortalSubmit = (e) => {
    e.preventDefault();
    console.log('Owner portal created:', formData);
    // TODO: Create owner portal and send confirmation email
    alert('Owner portal created successfully!');
  };

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {step === 1 ? (
          <>
            {/* Step 1: Lead Generation Form */}
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
                The only provider offering both
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3 text-2xl md:text-3xl font-medium">
                <span className="text-gray-900">Airbnb management</span>
                <span className="text-gray-400">&</span>
                <span className="text-gray-900">long-term rentals</span>
              </div>
              <p className="text-lg text-gray-600 font-light pt-4">
                Check how much you can earn with us
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="relative">
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
                      className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
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
                          className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative animate-fade-in">
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange('phone')}
                          placeholder="Phone number"
                          className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative animate-fade-in md:col-span-2">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={handleChange('email')}
                          placeholder="Email address"
                          className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 animate-fade-in">
                      <button
                        type="submit"
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl text-base font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Calculate my earnings
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
          </>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default LeadGenSection;
