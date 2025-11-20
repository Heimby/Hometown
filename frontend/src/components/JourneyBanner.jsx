import React from 'react';

const JourneyBanner = () => {
  return (
    <section className="relative w-full" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="w-full">
        <img
          src="https://customer-assets.emergentagent.com/job_rental-wizard-7/artifacts/eok2rvtr_image.png"
          alt="DigiHome - Vår reise hittil"
          className="w-full h-auto object-contain"
          style={{ display: 'block', maxWidth: '100%' }}
        />
      </div>
    </section>
  );
};

export default JourneyBanner;
