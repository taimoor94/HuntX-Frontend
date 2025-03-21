import React from "react";
import Navbar from "../components/Navbar";

const CareerTips = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Career Tips from HuntX
        </h2>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary">1. Tailor Your Resume</h3>
            <p className="text-gray-600">
              Customize your resume for each job application to highlight relevant skills and experiences.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary">2. Network Effectively</h3>
            <p className="text-gray-600">
              Connect with professionals in your industry on platforms like LinkedIn to discover hidden opportunities.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary">3. Prepare for Interviews</h3>
            <p className="text-gray-600">
              Research the company, practice common questions, and be ready to discuss your achievements.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary">4. Upskill Regularly</h3>
            <p className="text-gray-600">
              Stay competitive by learning new skills through online courses or certifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTips;