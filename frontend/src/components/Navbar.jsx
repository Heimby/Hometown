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
        isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-[44px] lg:h-[52px]">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <a href="/" className="flex items-center h-full py-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/ke4s6nwo_4633C819.svg"
              alt="1X Logo"
              className="h-full w-auto transition-transform duration-300 hover:scale-110"
              style={{
                filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
                transform: 'scale(0.5)'
              }}
            />
          </a>

          {/* Center Navigation - Desktop only */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[11px] font-medium uppercase tracking-wider transition-all duration-300 relative group ${
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

          {/* Tenant Button */}
          <a
            href="#"
            className={`text-[11px] font-medium uppercase tracking-wider transition-all duration-300 hover:opacity-50 ${
              isScrolled
                ? 'text-gray-900'
                : 'text-white'
            }`}
          >
            I'm a tenant
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
