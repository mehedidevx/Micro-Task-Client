import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaHome,
  FaTasks,
  FaPlus,
  FaUserFriends,
  FaClipboardCheck,
  FaListAlt,
  FaWallet,
  FaMoneyCheckAlt,
  FaCoins,
  FaUser,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

import { useQuery } from "@tanstack/react-query";
import Footer from "../pages/Home/Footer";
import NotificationDropdown from "../components/NotificationDropdown/NotificationDropdown";
import useAxios from "../hooks/useAxios";


const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { role, roleLoading } = useUserRole();
  const axios = useAxios();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  // fetch all users and get current user from email
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

  return (
    <div className="bg-base-100">
      <div className="flex flex-col">
        {/* Navbar */}
        <div className="bg-base-100 sticky top-0 z-50 ">
          <div className="h-[80px] container mx-auto px-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label
                htmlFor="dashboard-drawer"
                className="btn btn-ghost drawer-button lg:hidden"
              >
                <FaBars className="text-xl" />
              </label>
              <NavLink to="/">
                <h2 className="text-2xl text-primary font-bold">MicroTask</h2>
              </NavLink>
            </div>

            <div className="flex items-center gap-4 relative">
              {/* Show role & coins */}
              <div className="text-sm text-right hidden sm:flex gap-2 flex-row-reverse">
                <p className="capitalize border font-bold border-primary p-1 px-3 rounded-full">
                  {role}
                </p>
                <h2 className="border border-primary font-bold p-1 px-3 rounded-full">
                  <FaCoins className="inline text-primary mr-1" />
                  {coins} <span className="hidden sm:inline">Coins</span>
                </h2>
              </div>

              {/* NEW Profile Dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img src={user?.photoURL || "/avatar.png"} alt="Profile" />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li className="font-semibold text-center">
                    {user?.displayName}
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/myProfile"
                      className="flex items-center space-x-2"
                    >
                      <FaUser />
                      <span>My Profile</span>
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 hover:text-red-500"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>

              <NotificationDropdown />
            </div>
          </div>
        </div>

        {/* Drawer layout */}
        <div className="drawer min-h-full gap-3 drawer-mobile  container mx-auto lg:drawer-open flex-1">
          <input
            id="dashboard-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-content shadow   p-4 bg-base-200">
            <Outlet />
          </div>

          <div className="drawer-side mt-20 z-50 lg:z-auto md:mt-0">
            <label
              htmlFor="dashboard-drawer"
              className="drawer-overlay"
            ></label>

            <ul className="menu p-4 w-72 z-52  min-h-full  bg-base-200 text-base-content space-y-1">
              {/* Common Links */}
              <div className="text-sm text-right sm:hidden flex gap-2 justify-between">
                <p className="capitalize border p-1 px-3 rounded-full">
                  {role}
                </p>
                <h2 className="border p-1 px-3 rounded-full">
                  <FaCoins className="inline text-yellow-500 mr-1" />
                  {coins} <span className="hidden sm:inline">Coins</span>
                </h2>
              </div>
              <div className="border-b hidden sm:inline my-2 border-gray-200"></div>
              <li>
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `${
                      isActive
                        ? "btn-primary text-white"
                        : ""
                    }`
                  }
                >
                  <FaHome className="mr-2" /> Home
                </NavLink>
              </li>

              {/* Role Based */}
              {!roleLoading && role === "Worker" && (
                <>
                  <li>
                    <NavLink to="/dashboard/taskList">
                      <FaTasks className="mr-2" /> Task List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/mySubmissions">
                      <FaClipboardCheck className="mr-2" /> My Submissions
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/withdrawals">
                      <FaWallet className="mr-2" /> Withdrawals
                    </NavLink>
                  </li>
                </>
              )}

              {!roleLoading && role === "Buyer" && (
                <>
                  <li>
                    <NavLink to="/dashboard/addTask">
                      <FaPlus className="mr-2" /> Add New Task
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/myTasks">
                      <FaListAlt className="mr-2" /> My Task’s
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/purchaseCoin">
                      <FaCoins className="mr-2" /> Purchase Coin
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/paymentHistory">
                      <FaMoneyCheckAlt className="mr-2" /> Payment History
                    </NavLink>
                  </li>
                </>
              )}

              {!roleLoading && role === "Admin" && (
                <>
                  <li>
                    <NavLink to="/dashboard/manageUsers">
                      <FaUserFriends className="mr-2" /> Manage Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/manageTasks">
                      <FaTasks className="mr-2" /> Manage Tasks
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <Footer></Footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
