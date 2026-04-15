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

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/admin-auth/setup-required`);
        setIsSetup(response.data.setupRequired);
      } catch (error) {
        console.error('Error checking setup:', error);
      }
    };
    checkSetup();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin-auth/login`, {
        username,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUsername', response.data.admin.username);
        setAdminLoggedIn(true);
        navigate('/admin');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
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
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin-auth/setup`, {
        username: setupData.username,
        password: setupData.password
      });
      
      if (response.data.success) {
        alert('Admin account created! Please login.');
        setShowSetup(false);
        setUsername(setupData.username);
        setPassword('');
        setSetupData({ username: '', password: '', confirmPassword: '' });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Elon <span className="text-[#FFD700]">Decor</span>
          </h1>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Admin {!showSetup ? 'Login' : 'Setup'}
          </h2>
        </div>
        
        {!showSetup ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="Username"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#FFD700] text-black rounded-lg font-semibold hover:bg-[#B8860B] disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
            
            {isSetup && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowSetup(true)}
                  className="text-sm text-[#FFD700] hover:text-[#B8860B]"
                >
                  First time? Create admin account
                </button>
              </div>
            )}
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSetup}>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={setupData.username}
                  onChange={(e) => setSetupData({...setupData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="Username"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  required
                  value={setupData.password}
                  onChange={(e) => setSetupData({...setupData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="Password (min 6 characters)"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  required
                  value={setupData.confirmPassword}
                  onChange={(e) => setSetupData({...setupData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-700 bg-[#1A1A1A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#FFD700] text-black rounded-lg font-semibold hover:bg-[#B8860B] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Admin Account'}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowSetup(false)}
                className="text-sm text-[#FFD700] hover:text-[#B8860B]"
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