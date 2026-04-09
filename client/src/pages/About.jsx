const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-[--font-playfair] font-bold text-center mb-6">
          About <span className="text-[--color-gold]">Elon Decor</span>
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Creating magical moments through exceptional decoration services
        </p>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[--color-gold]">Our Story</h2>
            <p className="text-gray-300 leading-relaxed">
              Elon Decor was founded with a passion for transforming ordinary spaces into extraordinary experiences. 
              We believe that every event deserves to be unique and memorable, reflecting the personality and vision 
              of our clients.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[--color-gold]">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To bring our clients' dreams to life through creative, high-quality decoration services that exceed 
              expectations and create lasting memories for every special occasion.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[--color-gold]">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed">
              To become the premier event decoration company in Ethiopia, known for innovation, quality, and 
              exceptional customer service.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[--color-gold]">Why Choose Us</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">✓</span>
                <span>Professional and experienced team</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">✓</span>
                <span>High-quality materials and decorations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">✓</span>
                <span>Customized designs tailored to your needs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">✓</span>
                <span>Competitive pricing and flexible packages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[--color-gold]">✓</span>
                <span>Timely setup and reliable service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;