import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../server/config';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPackages();
  }, []);
  
  const fetchPackages = async () => {
    try {
      const response = await axios.get('${API_URL}/packages');
      if (response.data && response.data.success) {
        setPackages(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[--color-black-bg] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[--color-gold] mb-4">Loading...</div>
          <p className="text-gray-400">Please wait while we load our packages</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
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
      
      <section className="container mx-auto px-4 py-16">
        {packages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No packages available yet. Please check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`relative bg-[--color-dark-gray] rounded-lg overflow-hidden ${
                  pkg.popular ? 'border-2 border-[--color-gold] transform md:scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-[--color-gold] text-black px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-[--color-gold]">ETB {pkg.price}</span>
                    <span className="text-gray-400"> / event</span>
                  </div>
                  {pkg.description && (
                    <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                  )}
                  <ul className="space-y-3 mb-8">
                    {pkg.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="text-[--color-gold]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a 
                    href="/booking" 
                    className="btn-primary"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <p className="text-center text-gray-400 mt-12 text-sm">
          * Prices are starting from. Final price depends on specific requirements and customization.
        </p>
      </section>
    </div>
  );
};

export default Packages;