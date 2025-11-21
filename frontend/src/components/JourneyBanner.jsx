import React from 'react';

const JourneyBanner = () => {
  return (
    <section className="relative py-16 px-4 sm:px-6" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="max-w-7xl mx-auto">
        <img
          src="https://customer-assets.emergentagent.com/job_rental-wizard-7/artifacts/eok2rvtr_image.png"
          alt="DigiHome - Vår reise hittil"
          className="w-full h-auto object-contain rounded-2xl shadow-2xl"
          style={{ display: 'block', maxWidth: '100%' }}
        />
      </div>
    </section>
  );
};

export default JourneyBanner;
