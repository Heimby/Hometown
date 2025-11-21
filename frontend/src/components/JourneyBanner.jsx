import React from 'react';

const JourneyBanner = () => {
  return (
    <section className="relative py-0 px-0 sm:px-6" style={{ backgroundColor: '#F9F8F4' }}>
      <div className="relative min-h-[400px] mx-auto overflow-hidden rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl" style={{ maxWidth: '100%' }}>
        <img
          src="https://customer-assets.emergentagent.com/job_rental-wizard-7/artifacts/eok2rvtr_image.png"
          alt="DigiHome - Vår reise hittil"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default JourneyBanner;
