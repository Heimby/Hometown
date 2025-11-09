import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LeadGenSection from './components/LeadGenSection';
import WhatWeAreSection from './components/WhatWeAreSection';
import WhyOwnersChooseSection from './components/WhyOwnersChooseSection';
import HowItWorksSection from './components/HowItWorksSection';
import ResultsSection from './components/ResultsSection';

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

      {/* Why Owners Choose DigiHome Section */}
      <WhyOwnersChooseSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Results From Real Properties Section */}
      <ResultsSection />
    </div>
  );
}

export default App;
