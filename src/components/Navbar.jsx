import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { toast } from "react-hot-toast";
import NotificationBell from "./NotificationBell";
import { Bell, MessageCircle, Sun, Moon, LogOut, User, Briefcase, Newspaper, HelpCircle, FileText } from "lucide-react";

const Navbar = () => {
  const { token, role, userId, setToken, setRole, setUserId } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [userName] = useState(localStorage.getItem("userName") || "My Account");

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully!");
    navigate("/signin");
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-400 dark:text-indigo-600">
              HuntX
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link
                  to="/jobs"
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Briefcase className="inline-block w-5 h-5 mr-1" />
                  Jobs
                </Link>
                <Link
                  to="/news-feed"
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Newspaper className="inline-block w-5 h-5 mr-1" />
                  News Feed
                </Link>
                <Link
                  to="/messaging"
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <MessageCircle className="inline-block w-5 h-5 mr-1" />
                  Messages
                </Link>
                {role === "Employer" && (
                  <Link
                    to="/post-job"
                    className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <Briefcase className="inline-block w-5 h-5 mr-1" />
                    Post Job
                  </Link>
                )}
                <NotificationBell />
                <Link
                  to={role === "Employer" ? "/employer-profile" : "/jobseeker-profile"}
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <User className="inline-block w-5 h-5 mr-1" />
                  {userName}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/jobs"
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Briefcase className="inline-block w-5 h-5 mr-1" />
                  Jobs
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
                <Link
                  to="/signin"
                  className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {token && (
              <button
                onClick={handleLogout}
                className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="inline-block w-5 h-5 mr-1" />
                Logout
              </button>
            )}

            <Link
              to="/contact-us"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              <HelpCircle className="inline-block w-5 h-5 mr-1" />
              Contact Us
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              <FileText className="inline-block w-5 h-5 mr-1" />
              Terms
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;