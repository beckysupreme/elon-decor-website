const Services = () => {
  const services = [
    {
      title: "Wedding Decoration",
      description: "Complete wedding decoration services including altar setup, centerpieces, aisle decor, and reception arrangements.",
      icon: "💍",
      features: ["Bridal bouquet", "Flower arrangements", "Stage decoration", "Table centerpieces"]
    },
    {
      title: "Birthday Decoration",
      description: "Fun and creative birthday setups tailored to the celebrant's age and preferences.",
      icon: "🎂",
      features: ["Balloon decorations", "Theme-based setup", "Birthday banners", "Photo backdrop"]
    },
    {
      title: "Engagement Setup",
      description: "Romantic engagement decorations to create the perfect proposal atmosphere.",
      icon: "💕",
      features: ["Flower arrangements", "Candle light setup", "Photo corners", "Stage decoration"]
    },
    {
      title: "Corporate Events",
      description: "Professional decorations for corporate events, conferences, and business gatherings.",
      icon: "🏢",
      features: ["Stage setup", "Brand integration", "Seating arrangements", "Lighting design"]
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[--color-black-bg] to-[--color-dark-gray] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold mb-4">
            Our <span className="text-[--color-gold]">Services</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We offer a wide range of decoration services to make your events truly memorable
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-[--color-dark-gray] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="p-8">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-[--color-gold]">{service.title}</h3>
                <p className="text-gray-300 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-400">
                      <span className="text-[--color-gold]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;