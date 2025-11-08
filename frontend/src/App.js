import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
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

      {/* Transform Your Home Section */}
      <TransformSection />
    </div>
  );
}

export default App;
