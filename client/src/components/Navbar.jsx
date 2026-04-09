import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setAdminLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Videos', path: '/videos' },
    { name: 'Packages', path: '/packages' },
    { name: 'Booking', path: '/booking' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setAdminLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-[--color-black-bg] border-b border-[--color-gold]/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-2xl font-[--font-playfair] font-bold">
            Elon <span className="text-[--color-gold]">Decor</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-white hover:text-[--color-gold] transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <Link
                  to="/admin"
                  className="text-[--color-gold] hover:text-white transition-colors duration-300"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-[--color-gold] transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block py-2 text-white hover:text-[--color-gold] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <Link
                  to="/admin"
                  className="block py-2 text-[--color-gold] hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-white hover:text-[--color-gold] transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;