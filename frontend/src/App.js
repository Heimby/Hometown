import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LeadGenSection from './components/LeadGenSection';
import TransformSection from './components/TransformSection';

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

      {/* Transform Your Home Section */}
      <TransformSection />
    </div>
  );
}

export default App;
