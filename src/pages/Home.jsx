import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import FancyButton from "../components/FancyButton";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs/featured");
        setFeaturedJobs(response.data);
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      }
    };
    fetchFeaturedJobs();
  }, []);

  const handleImageError = (e) => {
    e.target.style.display = "none"; // Hide the broken image
    e.target.nextSibling.style.display = "block"; // Show fallback
  };

  return (
    <div className="bg-gray-100">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-hero h-[80vh] flex items-center justify-center text-center text-white">
        <div className="max-w-4xl mx-auto px-6 fade-in">
          <h1 className="text-6xl font-bold mb-6">
            Find Your Dream Job with HuntX
          </h1>
          <p className="text-xl mb-8">
            Explore thousands of job opportunities tailored to your skills and aspirations.
          </p>
          <div className="flex justify-center space-x-4">
            <FancyButton text="Browse Jobs" onClick={() => navigate("/jobs")} />
            <FancyButton text="Post a Job" onClick={() => navigate("/post-job")} />
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Featured Jobs
        </h2>
        {featuredJobs.length === 0 ? (
          <p className="text-center text-gray-600">No featured jobs available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-3xl transition duration-300 transform hover:-translate-y-2 fade-in"
              >
                <h3 className="text-xl font-semibold text-primary">{job.title}</h3>
                <p className="text-gray-700">{job.company}</p>
                <p className="text-gray-600 mt-2">{job.location} - {job.jobType}</p>
                <p className="text-gray-600">${job.hourlyRate}/hr</p>
                <button
                  onClick={() => navigate("/jobs")}
                  className="mt-4 text-primary hover:underline"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services Section */}
      <div className="bg-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Why Choose HuntX?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-3xl transition duration-300 transform hover:-translate-y-2 fade-in relative">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
                alt="Job Search"
                className="rounded-lg mb-4 w-full h-48 object-cover"
                onError={handleImageError}
              />
              <div
                className="hidden absolute inset-0 bg-gray-300 rounded-lg mb-4 flex items-center justify-center text-gray-600"
                style={{ height: "192px" }}
              >
                Image Not Available
              </div>
              <h3 className="text-xl font-semibold text-primary">Search Jobs</h3>
              <p className="text-gray-600">Find the perfect role with our advanced search tools.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-3xl transition duration-300 transform hover:-translate-y-2 fade-in relative">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
                alt="Post Jobs"
                className="rounded-lg mb-4 w-full h-48 object-cover"
                onError={handleImageError}
              />
              <div
                className="hidden absolute inset-0 bg-gray-300 rounded-lg mb-4 flex items-center justify-center text-gray-600"
                style={{ height: "192px" }}
              >
                Image Not Available
              </div>
              <h3 className="text-xl font-semibold text-primary">Post Jobs</h3>
              <p className="text-gray-600">Hire top talent by posting your openings here.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-2xl hover:shadow-3xl transition duration-300 transform hover:-translate-y-2 fade-in relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80"
                alt="Career Tips"
                className="rounded-lg mb-4 w-full h-48 object-cover"
                onError={handleImageError}
              />
              <div
                className="hidden absolute inset-0 bg-gray-300 rounded-lg mb-4 flex items-center justify-center text-gray-600"
                style={{ height: "192px" }}
              >
                Image Not Available
              </div>
              <h3 className="text-xl font-semibold text-primary">Career Tips</h3>
              <p className="text-gray-600">Get advice to boost your job hunt success.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-2xl fade-in">
            <p className="text-gray-600 italic">"HuntX helped me land my dream job in just two weeks!"</p>
            <p className="mt-4 font-semibold text-primary">— Sarah K., Software Engineer</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-2xl fade-in">
            <p className="text-gray-600 italic">"Posting jobs here was so easy, and we found great candidates!"</p>
            <p className="mt-4 font-semibold text-primary">— Mark T., HR Manager</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-bgDark text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-lg">© 2025 HuntX. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-primary transition duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition duration-300">Terms of Service</a>
            <a href="#" className="hover:text-primary transition duration-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;