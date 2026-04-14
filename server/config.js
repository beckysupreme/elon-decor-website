// API Configuration
const getApiUrl = () => {
  // Check for Vercel environment variable first
  if (import.meta.env.VITE_API_URL) {
    console.log('Using VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Production fallback - REPLACE with your actual Render URL
  if (import.meta.env.PROD) {
    return 'https://elon-decor-api.onrender.com/api';
  }
  
  // Local development
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

console.log('API_URL:', API_URL); // This will help debug

export default {
  API_URL,
  BOOKINGS_URL: `${API_URL}/bookings`,
  GALLERY_URL: `${API_URL}/gallery`,
  VIDEOS_URL: `${API_URL}/videos`,
  PACKAGES_URL: `${API_URL}/packages`,
  ADMIN_AUTH_URL: `${API_URL}/admin-auth`
};