import React from "react";

const services = [
  {
    icon: "💻",
    title: "Web Development",
    description: "Build responsive and modern websites with ease.",
  },
  {
    icon: "🎨",
    title: "Graphic Design",
    description: "Creative designs to make your brand stand out.",
  },
  {
    icon: "📈",
    title: "Digital Marketing",
    description: "Grow your business with targeted marketing strategies.",
  },
];

const FeaturedServices = () => {
  return (
    <section className="container mx-auto  py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10">Featured Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div key={idx} className="bg-base-200 p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-5xl mb-4 text-center">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-center">{service.title}</h3>
            <p className="text-center text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedServices;
