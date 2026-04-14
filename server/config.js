// API Configuration
const getApiUrl = () => {
  // Production on Vercel - REPLACE with your actual Render URL
  if (import.meta.env.PROD) {
    return 'https://elon-decor-api.onrender.com/api';
  }
  // Local development
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Export as named exports
export const BOOKINGS_URL = `${API_URL}/bookings`;
export const GALLERY_URL = `${API_URL}/gallery`;
export const VIDEOS_URL = `${API_URL}/videos`;
export const PACKAGES_URL = `${API_URL}/packages`;
export const ADMIN_AUTH_URL = `${API_URL}/admin-auth`;

// For debugging
console.log('API_URL:', API_URL);
console.log('GALLERY_URL:', GALLERY_URL);