import { useState, useEffect } from 'react';
import axios from 'axios';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const BACKEND_URL = 'https://elon-decor-api.onrender.com';
  
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching packages from:', `${BACKEND_URL}/api/packages`);
      
      const response = await axios.get(`${BACKEND_URL}/api/packages`);
      console.log('Packages response:', response.data);
      
      if (response.data && response.data.success) {
        setPackages(response.data.data || []);
      } else {
        setPackages([]);
        setError('No packages found');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages. Please try again later.');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[--color-black-bg] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[--color-gold] mb-4">Loading Packages...</div>
          <p className="text-gray-400">Please wait while we load our packages</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[--color-black-bg]">
        <section className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold mb-4">
              Packages & <span className="text-[--color-gold]">Pricing</span>
            </h1>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchPackages}
              className="mt-4 px-6 py-2 bg-[--color-gold] text-black rounded-lg font-semibold hover:bg-[--color-dark-gold]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="min-h-screen bg-[--color-black-bg]">
        <section className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold mb-4">
              Packages & <span className="text-[--color-gold]">Pricing</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose the perfect package that suits your event needs and budget
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <p className="text-gray-400">No packages available yet. Please check back soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-black-bg]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold mb-4">
            Packages & <span className="text-[--color-gold]">Pricing</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose the perfect package that suits your event needs and budget
          </p>
        </div>
      </section>
      
<section className="pricing-section">
  <div className="pricing-grid">
    {packages.map((pkg) => (
      <div 
        key={pkg._id}
        className={`pricing-card ${pkg.popular ? 'popular' : ''}`}
      >
        {pkg.popular && (
          <div className="popular-badge">
            Most Popular
          </div>
        )}
        <div className="card-content">
          <h3 className="package-name">{pkg.name}</h3>
          <div className="price">
            <span className="price-amount">ETB {pkg.price}</span>
            <span className="price-period"> / event</span>
          </div>
          {pkg.description && (
            <p className="package-description">{pkg.description}</p>
          )}
          <ul className="features-list">
            {pkg.features?.map((feature, idx) => (
              <li key={idx}>
                <span className="checkmark">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <a href="/booking" className="book-btn">
            Book Now
          </a>
        </div>
      </div>
    ))}
  </div>
  
  <p className="pricing-note">
    * Prices are starting from. Final price depends on specific requirements and customization.
  </p>
</section>
    </div>
  );
};

export default Packages;