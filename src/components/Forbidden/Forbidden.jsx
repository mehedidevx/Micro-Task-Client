import React from 'react';
import { Link } from 'react-router-dom';
import { FaBan } from 'react-icons/fa';

const Forbidden = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4">
      <FaBan className="text-6xl text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">Access Forbidden</h1>
      <p className="text-gray-600 mb-4">
        You don't have permission to access this page.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default Forbidden;
