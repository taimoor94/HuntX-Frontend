import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const { token, userId } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/notifications/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        toast.error("Failed to fetch notifications.");
        console.error("Error fetching notifications:", error);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessageNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        socket.off("newMessageNotification");
      };
    }
  }, [socket]);

  const handleMarkAsRead = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/notifications/mark-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
      toast.success("Notifications marked as read!");
    } catch (error) {
      toast.error("Failed to mark notifications as read.");
      console.error("Error marking notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800/90 dark:bg-gray-200/90 backdrop-blur-lg rounded-lg shadow-xl border border-gray-700 dark:border-gray-300 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-indigo-400 dark:text-indigo-600">
                Notifications
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAsRead}
                  className="text-sm text-indigo-400 dark:text-indigo-600 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-600 text-center">No notifications</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <Link
                    key={notif._id}
                    to={
                      notif.type === "message"
                        ? "/messaging"
                        : notif.type === "job"
                        ? `/job/${notif.relatedId}`
                        : notif.type === "post"
                        ? "/news-feed"
                        : "/employer-profile"
                    }
                    className={`block p-3 rounded-lg transition-all duration-300 ${
                      notif.read
                        ? "bg-gray-700/50 dark:bg-gray-300/50"
                        : "bg-indigo-600/50 dark:bg-indigo-500/50"
                    } hover:bg-indigo-500/50 dark:hover:bg-indigo-400/50`}
                    onClick={() => setIsOpen(false)}
                  >
                    <p className="text-gray-300 dark:text-gray-700">{notif.message}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-600">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-indigo-400 dark:text-indigo-600 capitalize">
                      {notif.type}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;