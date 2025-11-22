import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LeadGenSection from './components/LeadGenSection';
import PricingSection from './components/PricingSection';
import MediaSection from './components/MediaSection';
import JourneyBanner from './components/JourneyBanner';
import WhatWeAreSection from './components/WhatWeAreSection';
import ProcessTimelineSection from './components/ProcessTimelineSection';
import ResultsSection from './components/ResultsSection';
import ProfessionalServicesSection from './components/ProfessionalServicesSection';
import OurPresenceSection from './components/OurPresenceSection';
import Footer from './components/Footer';
import OwnerPortalDashboard from './components/OwnerPortalDashboard';
import PropertyDocumentation from './components/PropertyDocumentation';
import PropertyView from './components/PropertyView';
import InvestorPage from './components/InvestorPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';

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

      {/* Journey Banner */}
      <JourneyBanner />

      {/* Media Section */}
      <MediaSection />

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
          <Route path="/owner-portal/documentation" element={<PropertyDocumentation />} />
          <Route path="/investors" element={<InvestorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
