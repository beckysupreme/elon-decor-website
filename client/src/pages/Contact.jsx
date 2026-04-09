const Contact = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold mb-4">
            Contact <span className="text-[--color-gold]">Us</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Get in touch with us for inquiries, bookings, or any questions
          </p>
        </div>
      </section>
      
      {/* Contact Info */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[--color-dark-gray] rounded-full flex items-center justify-center text-2xl">
                  📞
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="font-semibold">+251 941 390 698</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[--color-dark-gray] rounded-full flex items-center justify-center text-2xl">
                  📍
                </div>
                <div>
                  <p className="text-gray-400">Location</p>
                  <p className="font-semibold">Addis Ababa, Ethiopia</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[--color-dark-gray] rounded-full flex items-center justify-center text-2xl">
                  ✉️
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="font-semibold">info@elondecor.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
            <div className="space-y-2">
              <p><span className="text-gray-400">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
              <p><span className="text-gray-400">Saturday:</span> 10:00 AM - 4:00 PM</p>
              <p><span className="text-gray-400">Sunday:</span> Closed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;