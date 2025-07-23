import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import useUserRole from "../../hooks/useUserRole";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loading from "../Loading/Loading";

const NotificationDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const bellRef = useRef();
  const { role } = useUserRole(); // 'Buyer', 'Worker', 'Admin'
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get notifications for Worker
  const { data: notifications = [], isLoading: workerLoading } = useQuery({
    queryKey: ["workerNotifications", user?.email],
    enabled: role === "Worker" && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/notifications?worker_email=${user.email}`);
      return res.data;
    },
  });

  // Get notifications (submissions) for Buyer
  const { data: BuyerNotifications = [], isLoading: buyerLoading } = useQuery({
    queryKey: ["BuyerNotifications", user?.email],
    enabled: role === "Buyer" && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions?buyer_email=${user.email}`);
      return res.data;
    },
  });
   const {submissions} = BuyerNotifications;
   console.log(submissions)
  const staticNotifications = {
    Buyer: ["A worker submitted a task.", "Task review pending."],
    Admin: ["New withdrawal request.", "User reported an issue."],
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle click on notification
  const handleNotificationClick = (notification) => {
    if (notification?.actionRoute) {
      navigate(notification.actionRoute);
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={bellRef}>
      <FaBell
        className="text-xl cursor-pointer"
        title="Notifications"
        onClick={() => setShowDropdown(!showDropdown)}
      />
      {showDropdown && (
        <div className="absolute right-0 mt-4 w-72 bg-[#1b756c] shadow-lg rounded-lg z-50 max-h-96 overflow-auto">
          <div className="p-4 font-bold border-b text-white">Notifications</div>

          {/* Worker Notifications */}
          {role === "Worker" ? (
            workerLoading ? (
              <Loading />
            ) : notifications.length > 0 ? (
              notifications.map((notification, i) => (
                <div
                  key={i}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-2 text-sm border-b cursor-pointer hover:bg-gray-900 ${
                    notification.read ? "text-gray-400" : "text-white font-semibold"
                  }`}
                >
                  You have earned {notification.coin} coins from {notification?.buyerName} for completing "{notification.title}"
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-400">No notifications</div>
            )
          ) : role === "Buyer" ? (
            // Buyer Notifications
            buyerLoading ? (
              <Loading />
            ) : submissions.length > 0 ? (
              submissions.map((submission, i) => (
                <div

                  key={i}
                  onClick={() =>
                    handleNotificationClick({
                      actionRoute: `/dashboard`,
                    })
                  }
                  className="px-4 py-2 text-sm border-b cursor-pointer hover:bg-gray-900 text-white"
                >
                  {submission.worker_name} submitted work on "{submission.task_title}"
                  
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-gray-400">No notifications</div>
            )
          ) : staticNotifications[role]?.length > 0 ? (
            // Admin static notifications
            staticNotifications[role].map((msg, i) => (
              <div
                key={i}
                className="px-4 py-2 text-sm border-b hover:bg-gray-900 text-white"
              >
                {msg}
              </div>
            ))
          ) : (
            <div className="p-4 text-sm text-gray-400">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
