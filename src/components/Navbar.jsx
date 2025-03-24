import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import CropModal from "./CropModal";
import API_BASE_URL from "../config";

const Navbar = () => {
  const { token, setToken, role, setRole, userId, setUserId, isDarkMode, setIsDarkMode } =
    useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/32");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/notifications/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const fetchProfilePicture = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user.profilePicture) {
          setProfilePicture(response.data.user.profilePicture);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchNotifications();
    fetchProfilePicture();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNotificationsClick = async () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/notifications/mark-read`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImage) => {
    const blob = await fetch(croppedImage).then((res) => res.blob());
    const formData = new FormData();
    formData.append("profilePicture", blob, "profile.jpg");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfilePicture(response.data.profilePicture);
      toast.success("Profile picture updated successfully!");
      setIsCropModalOpen(false);
    } catch (error) {
      toast.error("Failed to upload profile picture.");
      console.error(error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 shadow-2xl py-4 px-6 flex justify-between items-center sticky top-0 z-50 transition-all duration-300">
      <h1
        className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent cursor-pointer"
        onClick={() => navigate("/")}
      >
        HuntX
      </h1>

      <div className="hidden md:flex items-center space-x-6">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 pl-4 pr-10 rounded-full bg-gray-800/50 dark:bg-gray-300/50 text-white dark:text-gray-900 border border-gray-600 dark:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-indigo-400 dark:text-indigo-600">
            🔍
          </button>
        </form>

        <a
          href="/"
          className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold transform hover:scale-105"
        >
          Home
        </a>
        <a
          href="/jobs"
          className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold transform hover:scale-105"
        >
          Jobs
        </a>
        <a
          href="/news-feed"
          className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold transform hover:scale-105"
        >
          News Feed
        </a>
        <a
          href="/career-tips"
          className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold transform hover:scale-105"
        >
          Career Tips
        </a>
        <a
          href="/messaging"
          className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold transform hover:scale-105"
        >
          Messages
        </a>

        <div className="relative" ref={notificationsRef}>
          <button
            onClick={handleNotificationsClick}
            className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 relative"
          >
            🔔
            {notifications.filter((notif) => !notif.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.filter((notif) => !notif.read).length}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 dark:bg-gray-200 rounded-lg shadow-xl z-50 animate-fadeIn">
              {notifications.length === 0 ? (
                <div className="px-4 py-2 text-gray-300 dark:text-gray-700">No notifications</div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`px-4 py-2 text-gray-300 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-300 ${
                      notif.read ? "opacity-50" : ""
                    }`}
                  >
                    {notif.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

        {token ? (
          <div className="relative flex items-center space-x-2" ref={dropdownRef}>
            <img
              src={profilePicture}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-indigo-500"
              onError={(e) => (e.target.src = "https://via.placeholder.com/32")}
            />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
            >
              My Account
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-40 w-48 bg-gray-800 dark:bg-gray-200 rounded-lg shadow-xl z-50 animate-fadeIn">
                <a
                  href={role === "Employer" ? "/employer-profile" : "/jobseeker-profile"}
                  className="block px-4 py-2 text-gray-300 dark:text-gray-700 hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white dark:hover:text-white transition duration-300"
                >
                  Profile
                </a>
                {role === "Employer" && (
                  <a
                    href="/post-job"
                    className="block px-4 py-2 text-gray-300 dark:text-gray-700 hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white dark:hover:text-white transition duration-300"
                  >
                    Post Job
                  </a>
                )}
                <label className="block px-4 py-2 text-gray-300 dark:text-gray-700 hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white dark:hover:text-white transition duration-300 cursor-pointer">
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-300 dark:text-gray-700 hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white dark:hover:text-white transition duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <a
              href="/signin"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold transform hover:scale-105"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="text-white dark:text-gray-900 font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
            >
              Sign Up
            </a>
          </>
        )}
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300 dark:text-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 dark:bg-gray-200 py-4 mt-4 rounded-lg shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <form onSubmit={handleSearch} className="relative w-3/4">
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 pl-4 pr-10 rounded-full bg-gray-700/50 dark:bg-gray-300/50 text-white dark:text-gray-900 border border-gray-600 dark:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-indigo-400 dark:text-indigo-600">
                🔍
              </button>
            </form>
            <a
              href="/"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/jobs"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jobs
            </a>
            <a
              href="/news-feed"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              News Feed
            </a>
            <a
              href="/career-tips"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Career Tips
            </a>
            <a
              href="/messaging"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Messages
            </a>
            <div className="relative">
              <button
                onClick={handleNotificationsClick}
                className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 relative"
              >
                🔔
                {notifications.filter((notif) => !notif.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter((notif) => !notif.read).length}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={toggleDarkMode}
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            {token ? (
              <>
                <a
                  href={role === "Employer" ? "/employer-profile" : "/jobseeker-profile"}
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </a>
                {role === "Employer" && (
                  <a
                    href="/post-job"
                    className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Post Job
                  </a>
                )}
                <label className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold cursor-pointer">
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/signin"
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300 font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="text-white dark:text-gray-900 font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-md hover:shadow-lg transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      )}

      {isCropModalOpen && (
        <CropModal
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setIsCropModalOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;