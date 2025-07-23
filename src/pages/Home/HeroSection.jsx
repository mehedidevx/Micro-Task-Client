import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import slider1 from "../../assets/slider1.jpg";
import slider2 from "../../assets/slider2.jpg";
import slider3 from "../../assets/slider3.jpg";

const slides = [
  {
    image: slider1,
    title: "Welcome to MicroTask",
    description: "Find Quick Gigs & Earn Instantly",
  },
  {
    image: slider2,
    title: "Hire Skilled Freelancers",
    description: "Connect with Experts Around the World",
  },
  {
    image: slider3,
    title: "Post Your Tasks Easily",
    description: "Get Work Done Fast & Secure",
  },
];

const HeroSection = () => {
  return (
    <div className="container mx-auto mt-4">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={800}
        emulateTouch
        className="rounded-lg overflow-hidden"
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="h-[70vh] w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#0000008c] bg-opacity-40 flex flex-col items-center justify-center text-white px-4">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-lg md:text-xl">{slide.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroSection;
