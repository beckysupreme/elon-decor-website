import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setAdminLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupData, setSetupData] = useState({ username: '', password: '', confirmPassword: '' });
  const [showSetup, setShowSetup] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  
  const navigate = useNavigate();
  
  const BACKEND_URL = 'https://elon-decor-api.onrender.com';

  // Check if setup is required
  useEffect(() => {
    const checkSetup = async () => {
      try {
        console.log('Checking if setup required...');
        const response = await axios.get(`${BACKEND_URL}/api/admin-auth/setup-required`);
        console.log('Setup required response:', response.data);
        setIsSetup(response.data.setupRequired);
      } catch (error) {
        console.error('Error checking setup:', error);
        setError('Cannot connect to server. Please check if backend is running.');
      }
    };
    checkSetup();
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await axios.post(
      'https://elon-decor-api.onrender.com/api/admin-auth/login',
      {
        username: username,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUsername', response.data.admin.username);
      setAdminLoggedIn(true);
      navigate('/admin');
    } else {
      setError(response.data.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError(err.response?.data?.message || 'Login failed. Check console for details.');
  } finally {
    setLoading(false);
  }
};

  const handleSetup = async (e) => {
    e.preventDefault();
    if (setupData.password !== setupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (setupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    console.log('Creating admin account...');
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin-auth/setup`, {
        username: setupData.username,
        password: setupData.password
      });
      
      console.log('Setup response:', response.data);
      
      if (response.data.success) {
        alert('Admin account created successfully! Please login.');
        setShowSetup(false);
        setUsername(setupData.username);
        setPassword('');
        setSetupData({ username: '', password: '', confirmPassword: '' });
      } else {
        setError(response.data.message || 'Setup failed');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError(error.response?.data?.message || 'Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[--color-black-bg] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header */}
        <div className="text-center">
          <h1 className="text-4xl font-[--font-playfair] font-bold">
            Elon <span className="text-[--color-gold]">Decor</span>
          </h1>
          <h2 className="mt-6 text-3xl font-[--font-playfair] font-bold text-white">
            Admin {!showSetup ? 'Login' : 'Setup'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {!showSetup 
              ? 'Enter your credentials to access the dashboard' 
              : 'Create your admin account'}
          </p>
        </div>
        
        {!showSetup ? (
          // Login Form
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-[--color-dark-gray] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-gold] focus:border-transparent sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-[--color-dark-gray] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-gold] focus:border-transparent sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[--color-gold] hover:bg-[--color-dark-gold] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-gold] disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Sign in'}
              </button>
            </div>
            
            {isSetup && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowSetup(true)}
                  className="text-sm text-[--color-gold] hover:text-[--color-dark-gold] transition-colors"
                >
                  First time? Create admin account
                </button>
              </div>
            )}
          </form>
        ) : (
          // Setup Form
          <form className="mt-8 space-y-6" onSubmit={handleSetup}>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="setup-username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="setup-username"
                  name="username"
                  type="text"
                  required
                  value={setupData.username}
                  onChange={(e) => setSetupData({...setupData, username: e.target.value})}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-[--color-dark-gray] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-gold] focus:border-transparent sm:text-sm"
                  placeholder="Choose a username"
                />
              </div>
              
              <div>
                <label htmlFor="setup-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="setup-password"
                  name="password"
                  type="password"
                  required
                  value={setupData.password}
                  onChange={(e) => setSetupData({...setupData, password: e.target.value})}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-[--color-dark-gray] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-gold] focus:border-transparent sm:text-sm"
                  placeholder="Choose a password (min 6 characters)"
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={setupData.confirmPassword}
                  onChange={(e) => setSetupData({...setupData, confirmPassword: e.target.value})}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-[--color-dark-gray] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[--color-gold] focus:border-transparent sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[--color-gold] hover:bg-[--color-dark-gold] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-gold] disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Admin Account'}
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowSetup(false)}
                className="text-sm text-[--color-gold] hover:text-[--color-dark-gold] transition-colors"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;