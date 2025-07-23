import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Sarah Ahmed",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "MicroTask helped me earn extra income while studying. It's fast, easy, and reliable!",
  },
  {
    name: "Tanvir Hossain",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "I found talented freelancers within minutes. The experience was seamless!",
  },
  {
    name: "Afsana Khatun",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    quote: "Posting tasks and getting work done has never been easier. Highly recommended!",
  },
];

const Testimonial = () => {
  return (
    <div className="container mx-auto py-12 ">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10">What Our Users Say</h2>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
      >
        {testimonials.map((user, index) => (
          <SwiperSlide key={index}>
            <div className="bg-base-200 p-6 md:p-10 rounded-xl shadow-md text-center container mx-auto">
              <img
                src={user.photo}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary"
              />
              <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
              <p className="text-gray-600 italic">"{user.quote}"</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonial;
