import React from "react";
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-100 py-6 mt-12 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary mb-4 md:mb-0 cursor-pointer">
          MicroTask
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 text-2xl text-gray-600 hover:text-primary">
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-700 transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://facebook.com/your-profile"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600 transition"
          >
            <FaFacebook />
          </a>
          <a
            href="https://github.com/your-profile"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-800 transition"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
