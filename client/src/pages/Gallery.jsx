import { useState, useEffect } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const categories = ['all', 'wedding', 'birthday', 'engagement', 'corporate', 'other'];
  
  // Direct backend URL
  const BACKEND_URL = 'https://elon-decor-api.onrender.com';
  
  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${BACKEND_URL}/api/gallery`;
      if (selectedCategory !== 'all') {
        url += `?category=${selectedCategory}`;
      }
      
      const response = await axios.get(url);
      
      if (response.data && response.data.success) {
        setImages(response.data.data || []);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Failed to load gallery images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      wedding: 'Wedding',
      birthday: 'Birthday',
      engagement: 'Engagement',
      corporate: 'Corporate',
      other: 'Other',
    };
    return labels[category] || category || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[--color-black-bg] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[--color-gold] mb-4">Loading...</div>
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
              Our <span className="text-[--color-gold]">Gallery</span>
            </h1>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchImages}
              className="mt-4 px-6 py-2 bg-[--color-gold] text-black rounded-lg font-semibold hover:bg-[--color-dark-gold]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-black-bg]">
      <section className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold mb-4">
            Our <span className="text-[--color-gold]">Gallery</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Browse through our portfolio of beautiful event decorations
          </p>
        </div>
      </section>
      
<section className="gallery-section">
  <div className="category-filters">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`category-btn ${
          selectedCategory === category ? 'active' : 'inactive'
        }`}
      >
        {category === 'all' ? 'All' : getCategoryLabel(category)}
      </button>
    ))}
  </div>
  
  {images.length === 0 ? (
    <div className="empty-state">
      <p>No images found in this category.</p>
    </div>
  ) : (
    <div className="gallery-grid">
      {images.map((image) => (
        <div 
          key={image._id}
          className="gallery-card"
          onClick={() => setSelectedImage(image)}
        >
          <img 
            src={image.imageUrl} 
            alt={image.title || 'Gallery image'}
            className="gallery-image"
          />
          <div className="gallery-overlay">
            <div className="overlay-content">
              <h3 className="overlay-title">{image.title || 'Untitled'}</h3>
              <p className="overlay-category">{getCategoryLabel(image.category)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-[--color-gold] transition-colors"
            >
              ×
            </button>
            <img 
              src={selectedImage.imageUrl} 
              alt={selectedImage.title || 'Gallery image'}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-semibold text-white">{selectedImage.title || 'Untitled'}</h3>
              <p className="text-gray-400 mt-2">{selectedImage.description || 'No description available'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;