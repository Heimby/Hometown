import React, { useState, useEffect } from 'react';

const Navbar = ({ isDark = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'AI', href: '#' },
    { name: 'STORIES', href: '#' },
    { name: 'CAREERS', href: '#' },
    { name: 'ABOUT', href: '#' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img 
                src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/ke4s6nwo_4633C819.svg"
                alt="1X Logo"
                className="h-24 w-24 transition-transform duration-300 group-hover:scale-110"
                style={{
                  filter: isScrolled ? 'none' : 'brightness(0) invert(1)'
                }}
              />
            </div>
          </a>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-all duration-300 relative group ${
                  isScrolled
                    ? 'text-gray-600 hover:text-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Order Button */}
          <button
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isScrolled
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-white text-black hover:bg-gray-100'
            } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
          >
            ORDER
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
