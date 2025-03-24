import React from "react";
import Navbar from "../components/Navbar";

const CareerTips = () => {
  const tips = [
    {
      title: "Craft a Standout Resume",
      description:
        "Highlight your achievements with quantifiable results. Tailor your resume to each job you apply for by including relevant keywords.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    },
    {
      title: "Ace Your Interview",
      description:
        "Prepare for common questions, research the company, and practice your answers. Show enthusiasm and ask insightful questions.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
    {
      title: "Network Effectively",
      description:
        "Attend industry events, join online communities, and connect with professionals on platforms like HuntX to build your network.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-12 p-8 bg-gray-800/70 dark:bg-gray-200/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-300 animate-fadeIn">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent">
          Career Tips
        </h2>
        <div className="space-y-8">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full md:w-1/3 h-48 object-cover rounded-lg"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available")}
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-300 dark:text-gray-700">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerTips;