import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Packages from './pages/Packages';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import GalleryManager from './pages/GalleryManager';
import Videos from './pages/Videos';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const setAdminLoggedIn = (status) => {
    setIsLoggedIn(status);
    if (!status) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
    }
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

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar isLoggedIn={isLoggedIn} setAdminLoggedIn={setAdminLoggedIn} />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login setAdminLoggedIn={setAdminLoggedIn} />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gallery-manager" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <GalleryManager />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;