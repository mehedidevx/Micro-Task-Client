import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaUserFriends,
  FaSignInAlt,
  FaCodeBranch,
  FaCoins,
  FaUser,
} from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useNavigate } from "react-router";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleLogOut = () => {
    logOut()
      .then((result) => {
        queryClient.invalidateQueries({ queryKey: ["userCoins", user?.email] });
        console.log(result);
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  // ✅ fetch all users and get current user from email
  const { data: users = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axios.get("/users");
      return res.data;
    },
    enabled: !!user?.email,
  });

  const currentUser = users.find((u) => u.email === user?.email);
  const coins = currentUser?.coin || 0;

  const menuLinks = (
    <>
      <li>
        <NavLink to="/">
          <FaHome className="inline mr-2" /> Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/tasks">
          <FaTasks className="inline mr-2" /> Browse Tasks
        </NavLink>
      </li>
      <li>
        <NavLink to="/about">
          <FaUserFriends className="inline mr-2" /> About
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : ""
            }
          >
            <AiOutlineDashboard className="inline mr-2" /> Dashboard
          </NavLink>
        </li>
      )}

      {!user && (
        <li className="lg:hidden">
          <NavLink to="/login">
            <FaSignInAlt className="inline mr-2" /> Login
          </NavLink>
        </li>
      )}

      {user && (
        <>
          <li className="lg:hidden">
            <NavLink to="/profile" className="flex items-center space-x-2">
              <FaUser />
              <span>My Profile</span>
            </NavLink>
          </li>
          <li className="lg:hidden">
            <button
              onClick={handleLogOut}
              className="flex  items-center space-x-2 hover:text-red-500"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="sticky top-0 bg-base-100 border-[#1484e01a] border-b shadow-sm z-50">
      <div className="navbar container mx-auto">
        {/* Left */}
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost font-bold text-primary bg-transparent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 font-bold text-gray-800 dark:text-white"
            >
              {menuLinks}
            </ul>
          </div>
          <Link to="/" className="ml-0 text-2xl   font-extrabold text-primary">
            MicroTask
          </Link>
        </div>

        {/* Center */}
        <div className="navbar-center hidden lg:gap-4 lg:flex">
          <ul className="menu menu-horizontal flex gap-2 font-bold text-gray-800 dark:text-white px-1">{menuLinks}</ul>
        </div>

        {/* Right */}
        <div className="navbar-end space-x-3">
          {!user && (
            <NavLink to="/login" className="btn btn-ghost lg:hidden btn-primary">
              <FaSignInAlt className="inline mr-2" /> Login
            </NavLink>
          )}

          {user && (
            <>
              <span className="normal-case text-sm font-bold btn  py-0">
                <FaCoins className="inline mr-1 text-primary" />
                {coins} <span className="hidden md:inline"></span>
              </span>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img src={user.photoURL || "/avatar.png"} alt="Profile" />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li className="font-semibold text-center">
                    {user.displayName}
                  </li>
                  <li>
                    <NavLink
                      to="/profile"
                      className="flex items-center space-x-2"
                    >
                      <FaUser />
                      <span>My Profile</span>
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogOut}
                      className="flex items-center space-x-2 hover:text-red-500"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>

              <a
                href="https://github.com/your-client-repo"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-circle hidden md:flex "
              >
                <FaCodeBranch />
              </a>
            </>
          )}

          {!user && (
            <NavLink
              to="/login"
              className="btn btn-ghost hidden lg:inline-flex btn-primary hover:border-none"
            >
              <FaSignInAlt className="inline mr-2 " /> Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
