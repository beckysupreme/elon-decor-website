// API Configuration
const isProduction = import.meta.env.PROD;

// Use your actual Render backend URL
const PROD_API_URL = 'https://elon-decor-api.onrender.com'; // Replace with your actual Render URL

export const API_URL = isProduction 
  ? `${PROD_API_URL}/api`
  : 'http://localhost:5000/api';

export const ADMIN_API_URL = isProduction
  ? `${PROD_API_URL}/api/admin-auth`
  : 'http://localhost:5000/api/admin-auth';

export const IMAGE_URL = isProduction
  ? PROD_API_URL
  : 'http://localhost:5000';