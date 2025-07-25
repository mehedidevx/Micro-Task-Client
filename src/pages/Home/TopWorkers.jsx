import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const getRandomRating = () => {
  // 3 থেকে 5 এর মধ্যে রেটিং র‍্যান্ডম
  return (Math.random() * 2 + 3).toFixed(1);
};

const TopWorkers = () => {
  const axios = useAxios();

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["topWorkers"],
    queryFn: async () => {
      const res = await axios.get("/users");
      return res.data;
    },
  });

  const topWorkers = users
    .filter((user) => user.role.toLowerCase() === "worker")
    .sort((a, b) => (b.coin || 0) - (a.coin || 0))
    .slice(0, 6);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center py-10 text-red-500">
        Failed to load workers.
      </div>
    );

  return (
    <div>
       <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mt-4 mb-10">Top Workers</h1>
      <div className="container mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
     
      {topWorkers.map((worker) => {
  const rating = getRandomRating();
  return (
    <div
      key={worker._id || worker.email}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 text-center"
    >
      {/* Profile Photo */}
      <div className="flex justify-center mb-4">
        <img
          src={worker.photo || "/default-user.png"}
          alt={worker.name || worker.email}
          className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-sm hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        {worker.name || worker.email}
      </h3>

      {/* Coins */}
      <p className="text-sm text-gray-500 mb-2">
        Coins: <span className="font-semibold text-primary">{worker.coin || 0}</span>
      </p>

      {/* Rating */}
      <div className="flex justify-center items-center space-x-2">
        <StarRating rating={rating} />
        <span className="text-gray-600 text-sm">{rating} Reviews</span>
      </div>
    </div>
  );
})}

    </div>
    </div>
  );
};

const StarRating = ({ rating }) => {
 
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    } else if (i === fullStars + 1 && halfStar) {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z"
          />
        </svg>
      );
    } else {
      stars.push(
        <svg
          key={i}
          className="w-5 h-5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.922-.755 1.688-1.54 1.118l-3.39-2.46a1 1 0 00-1.175 0l-3.39 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    }
  }

  return <div className="flex">{stars}</div>;
};

export default TopWorkers;
