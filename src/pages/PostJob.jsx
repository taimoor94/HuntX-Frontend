import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";

const PostJob = () => {
  const { token, role } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    hourlyRate: "",
    location: "",
    jobType: "",
    isFeatured: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== "Employer") {
      toast.error("Only Employers can post jobs");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/jobs/post`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        company: "",
        hourlyRate: "",
        location: "",
        jobType: "",
        isFeatured: false,
      });
    } catch (error) {
      toast.error("Failed to post job. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-gray-800/70 dark:bg-gray-200/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-300 animate-fadeIn">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent">
          Post a New Job
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Job Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              rows="6"
              placeholder="Describe the job role, responsibilities, and requirements..."
              required
            />
          </div>
          <InputField
            label="Company Name"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Hourly Rate ($/hr)"
            type="number"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
              Job Type
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              required
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-600 dark:border-gray-400 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-200 dark:text-gray-700">
              Mark as Featured Job
            </label>
          </div>
          <FancyButton type="submit" className="w-full">
            Post Job
          </FancyButton>
        </form>
      </div>
    </div>
  );
};

export default PostJob;