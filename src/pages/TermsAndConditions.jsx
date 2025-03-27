import React from "react";
import Navbar from "../components/Navbar";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-400 dark:text-indigo-600">
          Terms and Conditions
        </h1>
        <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400 dark:text-indigo-600">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-200 dark:text-gray-700 mb-6">
              By accessing or using HuntX, you agree to be bound by these Terms and Conditions.
              If you do not agree, please do not use our services.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400 dark:text-indigo-600">
              2. User Responsibilities
            </h2>
            <p className="text-gray-200 dark:text-gray-700 mb-6">
              You are responsible for maintaining the confidentiality of your account and password.
              You agree to provide accurate and complete information when using HuntX.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400 dark:text-indigo-600">
              3. Prohibited Activities
            </h2>
            <p className="text-gray-200 dark:text-gray-700 mb-6">
              You may not use HuntX for any illegal or unauthorized purpose, including but not
              limited to posting false job listings, harassing other users, or distributing
              malicious content.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400 dark:text-indigo-600">
              4. Intellectual Property
            </h2>
            <p className="text-gray-200 dark:text-gray-700 mb-6">
              All content on HuntX, including text, graphics, logos, and software, is the property
              of HuntX or its licensors and is protected by copyright laws.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400 dark:text-indigo-600">
              5. Limitation of Liability
            </h2>
            <p className="text-gray-200 dark:text-gray-700">
              HuntX is not liable for any damages arising from your use of the platform, including
              but not limited to loss of data, loss of employment opportunities, or any other
              indirect damages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;