const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[--color-black-bg] to-[--color-dark-gray]">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center px-4 z-10">
          <h1 className="text-5xl md:text-7xl font-[--font-playfair] font-bold mb-4">
            Transform Your <span className="text-[--color-gold]">Moments</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional event decoration for weddings, birthdays, engagements, and special celebrations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/booking" className="btn-primary inline-block">
              Book Your Event Now
            </a>
            <a href="/gallery" className="btn-secondary inline-block">
              View Our Work
            </a>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-[--font-playfair] font-bold text-center mb-4">
            Our <span className="text-[--color-gold]">Services</span>
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            We specialize in creating magical moments for all your special occasions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-[--color-dark-gray] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 p-6 text-center"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const services = [
  {
    icon: "💍",
    title: "Wedding Decoration",
    description: "Elegant and romantic wedding setups tailored to your love story with premium flowers and decor."
  },
  {
    icon: "🎂",
    title: "Birthday Decoration",
    description: "Fun and creative birthday themes for all ages, from kids parties to milestone celebrations."
  },
  {
    icon: "💕",
    title: "Engagement Setup",
    description: "Romantic engagement decorations for your special moment, creating unforgettable memories."
  }
];

export default Home;