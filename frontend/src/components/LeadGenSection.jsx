import React, { useState } from 'react';
import { MapPin, User, Phone, Mail } from 'lucide-react';

const LeadGenSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    name: '',
    phone: '',
    email: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative">
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
            {/* Address Field - Always visible */}
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
                />
              </div>
            </div>

            {/* Expanded Fields - Show only when expanded */}
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
      </div>
    </section>
  );
};

export default LeadGenSection;
