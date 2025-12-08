import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = ({ isDark = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[56px] sm:h-[60px] lg:h-[52px]">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <a href="/" className="flex items-center h-full py-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_neo-copier/artifacts/ke4s6nwo_4633C819.svg"
                alt="Heimby Logo"
                className="h-full w-auto transition-transform duration-300 hover:scale-110"
                style={{
                  filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
                  transform: 'scale(0.7)'
                }}
              />
            </a>

            {/* Desktop Login Button */}
            <a
              href="/login"
              className={`hidden sm:block text-[11px] font-medium uppercase tracking-wider transition-all duration-300 hover:opacity-50 ${
                isScrolled
                  ? 'text-gray-900'
                  : 'text-white'
              }`}
            >
              Logg inn
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-[56px] right-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="flex flex-col p-6 space-y-6">
              <a
                href="/login"
                className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Logg inn
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
