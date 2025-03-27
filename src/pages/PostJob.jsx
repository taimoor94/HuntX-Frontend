import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";
import { Briefcase } from "lucide-react";

const PostJob = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    hourlyRate: "",
    location: "",
    jobType: "",
    isFeatured: false,
    requirements: "",
    benefits: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/jobs/post`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job posted successfully!");
      navigate("/employer-profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job.");
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <Briefcase className="w-12 h-12 text-indigo-400 dark:text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-8 text-indigo-400 dark:text-indigo-600">
              Post a New Job
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter job title"
                required
              />
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter job description"
                  className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 h-32"
                  required
                />
              </div>
              <InputField
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
              <InputField
                label="Hourly Rate ($)"
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="Enter hourly rate"
                required
              />
              <InputField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter job location"
                required
              />
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  required
                >
                  <option value="" disabled>
                    Select job type
                  </option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Enter job requirements"
                  className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 h-32"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                  Benefits
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="Enter job benefits"
                  className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 h-32"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-600 dark:border-gray-400 rounded"
                />
                <label className="ml-2 text-sm text-gray-200 dark:text-gray-700">
                  Mark as Featured Job
                </label>
              </div>
              <FancyButton type="submit" className="w-full">
                Post Job
              </FancyButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;