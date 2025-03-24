import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import FancyButton from "../components/FancyButton";
import InputField from "../components/InputField";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setToken, setRole } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error("All fields are required!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      // setMessage(response.data.message);
      toast.success(response.data.message);
      setFormData({ name: "", email: "", password: "", role: "" });
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      // setMessage(error.response?.data?.message || "Sign up failed!");
      toast.error(error.response?.data?.message || "Sign up failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
      <Navbar />
      <ToastContainer />
      <div className="flex justify-center items-center mt-16 relative z-10">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-105 transition duration-500 border-t-4 border-primary">
          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Join HuntX
          </h2>
          {message && (
            <p className={`text-center mb-6 ${message.includes("failed") ? "text-red-500" : "text-green-500"} font-semibold`}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              type="text"
              placeholder="John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              type="email"
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                I am a:
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 shadow-inner border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 hover:shadow-md"
              >
                <option value="">Select Role</option>
                <option value="Employer">Employer</option>
                <option value="Job Seeker">Job Seeker</option>
              </select>
            </div>
            <div className="flex justify-center">
              <FancyButton text="Sign Up Now" />
            </div>
          </form>
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-primary hover:underline font-semibold">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;