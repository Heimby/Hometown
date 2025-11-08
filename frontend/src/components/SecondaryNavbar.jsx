import React, { useState, useEffect } from 'react';

const SecondaryNavbar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > window.innerHeight - 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    'UTILITY',
    'DESIGN',
    'COMPANION',
    'INTELLIGENCE',
    'FAQ',
    'Product',
  ];

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky ? 'sticky top-0 shadow-md bg-white z-40' : 'relative bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium text-gray-900">NEO</h2>
            <span className="text-sm text-gray-500 font-light">Home Robot</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors duration-300 font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Order Button */}
          <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
