import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import FancyButton from "../components/FancyButton";
import JobCard from "../components/JobCard";
import API_BASE_URL from "../config";
import backgroundImage from "../assets/career.avif";

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/featured`);
        setFeaturedJobs(response.data);
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      }
    };

    const fetchTopCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/top-companies`);
        setTopCompanies(response.data);
      } catch (error) {
        console.error("Error fetching top companies:", error);
      }
    };

    fetchFeaturedJobs();
    fetchTopCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-indigo-900/80 dark:from-gray-100/80 dark:to-indigo-200/80 z-0"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent">
            Discover Your Dream Job with HuntX
          </h1>
          <p className="text-lg md:text-xl text-gray-300 dark:text-gray-700 mb-8">
            Connect with opportunities that match your skills and aspirations in just a few clicks.
          </p>
          <div className="flex justify-center space-x-4">
            <FancyButton onClick={() => window.location.href = "/jobs"}>
              Browse Jobs
            </FancyButton>
            <FancyButton onClick={() => window.location.href = "/post-job"}>
              Post a Job
            </FancyButton>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent animate-fadeIn">
          Featured Jobs
        </h2>
        {featuredJobs.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-600">No featured jobs available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Top Companies Section */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent animate-fadeIn">
            Top Companies Hiring
          </h2>
          {topCompanies.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-600">No companies hiring at the moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {topCompanies.map((company, index) => (
                <div
                  key={index}
                  className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 animate-fadeIn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 text-center">
                    <img
                      src={company.logo || "https://via.placeholder.com/100"}
                      alt={company.name}
                      className="w-16 h-16 mx-auto mb-4 rounded-full"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                    />
                    <h3 className="text-xl font-semibold text-indigo-400 dark:text-indigo-600">{company.name}</h3>
                    <FancyButton
                      onClick={() => window.location.href = `/jobs?company=${company.name}`}
                      className="mt-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-400 dark:hover:bg-gray-500"
                    >
                      View Jobs
                    </FancyButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Why Choose HuntX Section */}
      <div className="bg-gray-900 dark:bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent animate-fadeIn">
            Why Choose HuntX?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 animate-fadeIn cursor-pointer"
              onClick={() => window.location.href = "/jobs"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                  alt="Job Search"
                  className="rounded-lg mb-4 w-full h-48 object-cover"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available")}
                />
                <h3 className="text-xl font-semibold text-indigo-400 dark:text-indigo-600">Search Jobs</h3>
                <p className="text-gray-400 dark:text-gray-600">Find the perfect role with our advanced search tools.</p>
              </div>
            </div>
            <div
              className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 animate-fadeIn cursor-pointer"
              onClick={() => window.location.href = "/post-job"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978"
                  alt="Post Jobs"
                  className="rounded-lg mb-4 w-full h-48 object-cover"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available")}
                />
                <h3 className="text-xl font-semibold text-indigo-400 dark:text-indigo-600">Post Jobs</h3>
                <p className="text-gray-400 dark:text-gray-600">Hire top talent by posting your openings here.</p>
              </div>
            </div>
            <div
              className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 animate-fadeIn cursor-pointer"
              onClick={() => window.location.href = "/career-tips"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                  alt="Career Tips"
                  className="rounded-lg mb-4 w-full h-48 object-cover"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available")}
                />
                <h3 className="text-xl font-semibold text-indigo-400 dark:text-indigo-600">Career Tips</h3>
                <p className="text-gray-400 dark:text-gray-600">Get advice to boost your job hunt success.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent animate-fadeIn">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl animate-fadeIn">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <p className="text-gray-400 dark:text-gray-600 italic relative z-10">
                "HuntX helped me land my dream job in just two weeks!"
              </p>
              <div className="flex items-center mt-4 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  alt="Sarah K."
                  className="w-10 h-10 rounded-full mr-3"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                />
                <p className="font-semibold text-indigo-400 dark:text-indigo-600">Sarah K., Software Engineer</p>
              </div>
            </div>
            <div className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl animate-fadeIn">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              <p className="text-gray-400 dark:text-gray-600 italic relative z-10">
                "Posting jobs here was so easy, and we found great candidates!"
              </p>
              <div className="flex items-center mt-4 relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
                  alt="Mark T."
                  className="w-10 h-10 rounded-full mr-3"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                />
                <p className="font-semibold text-indigo-400 dark:text-indigo-600">Mark T., HR Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white dark:text-gray-200 mb-6 animate-fadeIn">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg text-gray-200 dark:text-gray-300 mb-8">
            Join thousands of professionals and employers on HuntX today.
          </p>
          <div className="flex justify-center space-x-4">
            <FancyButton onClick={() => window.location.href = "/signup"}>
              Get Started
            </FancyButton>
            <FancyButton
              onClick={() => window.location.href = "/jobs"}
              className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
            >
              Explore Jobs
            </FancyButton>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 dark:text-gray-600 text-lg">© 2025 HuntX. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a
              href="#"
              className="text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;