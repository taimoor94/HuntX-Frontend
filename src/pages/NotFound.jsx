import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        <AlertCircle className="w-24 h-24 text-indigo-400 dark:text-indigo-600 mb-6" />
        <h1 className="text-4xl font-bold text-center mb-4 text-indigo-400 dark:text-indigo-600">
          404 - Page Not Found
        </h1>
        <p className="text-gray-200 dark:text-gray-700 text-center mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;