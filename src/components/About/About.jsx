import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h2
        className="text-4xl font-bold text-center mb-10 text-primary"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Our Platform
      </motion.h2>

      <motion.div
        className=" rounded-2xl shadow-xl p-8 md:p-12 text-gray-500 text-lg leading-relaxed space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.p
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Welcome to our freelance micro-task marketplace, where innovation
          meets opportunity. We connect passionate workers with task providers
          in a secure, fast, and rewarding platform.
        </motion.p>

        <motion.p
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Whether you're a business looking to outsource tasks or a freelancer
          wanting to earn coins by completing small jobs — our platform is
          designed for you.
        </motion.p>

        <motion.p
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          With our coin-based system, real-time updates, secure payments, and
          personalized dashboards, managing your tasks and earnings has never
          been easier.
        </motion.p>

        <motion.p
          className="text-primary font-semibold"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Join us today and take control of your freelance journey!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default About;
