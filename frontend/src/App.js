import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LeadGenSection from './components/LeadGenSection';
import WhatWeAreSection from './components/WhatWeAreSection';
import HowItWorksSection from './components/HowItWorksSection';
import ResultsSection from './components/ResultsSection';
import OurPresenceSection from './components/OurPresenceSection';
import ExpansionMarketsSection from './components/ExpansionMarketsSection';
import PioneerBenefitsSection from './components/PioneerBenefitsSection';

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

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Results From Real Properties Section */}
      <ResultsSection />

      {/* Our Presence Section */}
      <OurPresenceSection />

      {/* Expansion Markets Section */}
      <ExpansionMarketsSection />

      {/* Pioneer Benefits Section */}
      <PioneerBenefitsSection />
    </div>
  );
}

export default App;
