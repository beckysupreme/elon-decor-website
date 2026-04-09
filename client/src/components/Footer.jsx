const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[--color-dark-gray] border-t border-[--color-gold]/20 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-[--font-playfair] font-bold mb-4">
              Elon <span className="text-[--color-gold]">Decor</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Creating unforgettable moments through exceptional event decoration services.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-[--color-gold] transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-[--color-gold] transition-colors">About Us</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-[--color-gold] transition-colors">Services</a></li>
              <li><a href="/gallery" className="text-gray-400 hover:text-[--color-gold] transition-colors">Gallery</a></li>
              <li><a href="/packages" className="text-gray-400 hover:text-[--color-gold] transition-colors">Packages</a></li>
              <li><a href="/booking" className="text-gray-400 hover:text-[--color-gold] transition-colors">Book Now</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span>📞</span>
                <span>+251 941 390 698</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <span>info@elondecor.com</span>
              </li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="#" className="text-gray-400 hover:text-[--color-gold] transition-colors flex items-center gap-2">
                <span>📷</span> Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-[--color-gold] transition-colors flex items-center gap-2">
                <span>📘</span> Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-[--color-gold] transition-colors flex items-center gap-2">
                <span>📱</span> Telegram
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-[--color-gold]/20 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Elon Decor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;