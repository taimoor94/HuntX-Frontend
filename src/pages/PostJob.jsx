import React, { useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import FancyButton from "../components/FancyButton";
import InputField from "../components/InputField";
import { AuthContext } from "../context/AuthContext";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    hourlyRate: "",
    location: "",
    jobType: "",
    isFeatured: false,
  });
  const [message, setMessage] = useState("");
  const { token, role } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("Please sign in to post a job!");
      return;
    }
    if (role !== "Employer") {
      setMessage("Only employers can post jobs!");
      return;
    }
    if (Object.values(formData).some((val) => !val && val !== false)) {
      setMessage("All fields are required!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/jobs/post", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
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
      setMessage(error.response?.data?.message || "Failed to post job!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Post a New Job on HuntX
        </h2>
        {message && (
          <p className={`text-center mb-6 ${message.includes("failed") ? "text-red-500" : "text-green-500"} font-semibold`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <InputField
            label="Job Title"
            type="text"
            placeholder="Software Engineer"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <InputField
            label="Company"
            type="text"
            placeholder="Tech Corp"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Description
            </label>
            <textarea
              placeholder="Job description..."
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 shadow-inner border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 hover:shadow-md"
              rows="4"
            />
          </div>
          <InputField
            label="Hourly Rate ($)"
            type="number"
            placeholder="25"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
          />
          <InputField
            label="Location"
            type="text"
            placeholder="Remote or City, Country"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Job Type
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-50 shadow-inner border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 hover:shadow-md"
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-primary"
              />
              <span className="text-gray-700 font-semibold">Mark as Featured Job</span>
            </label>
          </div>
          <div className="flex justify-center">
            <FancyButton text="Post Job Now" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;