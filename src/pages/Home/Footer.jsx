import React from "react";
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-base-200 mt-10">
      <footer className=" text-gray-700 dark:text-white mt-10">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 lg:flex lg:justify-between gap-8">
        {/* Branding */}
        <div className="lg:w-1/3  flex-1">
          <h2 className="text-3xl font-bold text-primary mb-3 cursor-pointer">
            MicroTask
          </h2>
          <p className="text-sm leading-relaxed">
            A micro-task and earning platform where buyers post tasks and
            workers earn coins by completing them efficiently.
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:w-1/3  lg:flex flex-col  items-center">
          <h3 className="text-lg font-semibold mb-3 text-primary">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="hover:text-primary transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className="hover:text-primary transition duration-200"
              >
                Browse Tasks
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="hover:text-primary transition duration-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-primary transition duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="lg:w-1/3  lg:flex flex-col  items-end">
          <h3 className="text-lg font-semibold mb-3 text-primary">
            Connect With Us
          </h3>
          <div className="flex space-x-6 text-2xl text-gray-600">
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
      </div>

      {/* Copyright  */}
      <div className="text-center py-4 bg-base-300 text-sm text-gray-500">
        © {new Date().getFullYear()} MicroTask. All rights reserved.
      </div>
    </footer>
    </div>
  );
};

export default Footer;
