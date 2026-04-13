// API Configuration
const isProduction = import.meta.env.PROD;

export const API_URL = isProduction 
  ? 'https://elon-decor-api.onrender.com/api'  // We'll update this after backend deploy
  : 'http://localhost:5000/api';

export const ADMIN_API_URL = isProduction
  ? 'https://elon-decor-api.onrender.com/api/admin-auth'
  : 'http://localhost:5000/api/admin-auth';