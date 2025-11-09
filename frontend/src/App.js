import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LeadGenSection from './components/LeadGenSection';
import WhatWeAreSection from './components/WhatWeAreSection';

function App() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="App">
      {/* Main Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Lead Generation Section */}
      <LeadGenSection />

      {/* What We Are Section */}
      <WhatWeAreSection />
    </div>
  );
}

export default App;
