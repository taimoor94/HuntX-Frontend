import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";
import { UserPlus } from "lucide-react";

const SignUp = () => {
  const { setToken, setRole, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
      setToken(response.data.token);
      setRole(response.data.role);
      setUserId(response.data.userId);
      localStorage.setItem("userName", response.data.userName);
      toast.success("Sign up successful!");
      navigate(response.data.role === "Employer" ? "/employer-profile" : "/jobseeker-profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign up failed.");
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
      <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <UserPlus className="w-12 h-12 text-indigo-400 dark:text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-center text-indigo-400 dark:text-indigo-600 mb-6">
            Sign Up for HuntX
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="Job Seeker">Job Seeker</option>
                <option value="Employer">Employer</option>
              </select>
            </div>
            <FancyButton type="submit" className="w-full">
              Sign Up
            </FancyButton>
          </form>
          <p className="mt-6 text-center text-gray-300 dark:text-gray-700">
            Already have an account?{" "}
            <a href="/signin" className="text-indigo-400 dark:text-indigo-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;