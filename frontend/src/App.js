import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LeadGenSection from './components/LeadGenSection';
import WhatWeAreSection from './components/WhatWeAreSection';
import HowItWorksSection from './components/HowItWorksSection';
import ResultsSection from './components/ResultsSection';
import ProfessionalServicesSection from './components/ProfessionalServicesSection';
import OurPresenceSection from './components/OurPresenceSection';
import ExpansionMarketsSection from './components/ExpansionMarketsSection';
import PioneerBenefitsSection from './components/PioneerBenefitsSection';
import OwnerPortalDashboard from './components/OwnerPortalDashboard';

function HomePage() {
  return (
    <>
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

      {/* Professional Services Section */}
      <ProfessionalServicesSection />

      {/* Our Presence Section */}
      <OurPresenceSection />

      {/* Expansion Markets Section */}
      <ExpansionMarketsSection />

      {/* Pioneer Benefits Section */}
      <PioneerBenefitsSection />
    </>
  );
}

function App() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/owner-portal" element={<OwnerPortalDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
    </div>
  );
}

export default App;
