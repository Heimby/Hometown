import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LeadGenSection from './components/LeadGenSection';
import LeadGenSectionSecondary from './components/LeadGenSectionSecondary';
import PricingSection from './components/PricingSection';
import WhatWeAreSection from './components/WhatWeAreSection';
import ProcessTimelineSection from './components/ProcessTimelineSection';
import ResultsSection from './components/ResultsSection';
import ProfessionalServicesSection from './components/ProfessionalServicesSection';
import OurPresenceSection from './components/OurPresenceSection';
import ExpansionMarketsSection from './components/ExpansionMarketsSection';
import PioneerBenefitsSection from './components/PioneerBenefitsSection';
import Footer from './components/Footer';
import OwnerPortalDashboard from './components/OwnerPortalDashboard';
import InvestorPage from './components/InvestorPage';

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

      {/* Process Timeline Section */}
      <ProcessTimelineSection />

      {/* Results From Real Properties Section */}
      <ResultsSection />

      {/* Professional Services Section */}
      <ProfessionalServicesSection />

      {/* Our Presence Section */}
      <OurPresenceSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
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
          <Route path="/investors" element={<InvestorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
