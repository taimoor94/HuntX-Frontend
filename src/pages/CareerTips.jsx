import React from "react";
import Navbar from "../components/Navbar";

const CareerTips = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-400 dark:text-indigo-600">
          Career Tips
        </h1>
        <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400 dark:text-indigo-600">
              1. Tailor Your Resume
            </h2>
            <p className="text-gray-200 dark:text-gray-700 mb-6">
              Customize your resume for each job application to highlight the most relevant skills
              and experiences.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400 dark:text-indigo-600">
              2. Network Effectively
            </h2>
            <p className="text-gray-200 dark:text-gray-700 mb-6">
              Build connections on platforms like HuntX to discover opportunities and gain insights
              from industry professionals.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400 dark:text-indigo-600">
              3. Prepare for Interviews
            </h2>
            <p className="text-gray-200 dark:text-gray-700">
              Research the company, practice common interview questions, and be ready to discuss
              your achievements confidently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTips;