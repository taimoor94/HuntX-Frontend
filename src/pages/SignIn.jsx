import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";
import { LogIn } from "lucide-react";

const SignIn = () => {
  const { setToken, setRole, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, formData);
      setToken(response.data.token);
      setRole(response.data.role);
      setUserId(response.data.userId);
      localStorage.setItem("userName", response.data.userName);
      toast.success("Sign in successful!");
      navigate(response.data.role === "Employer" ? "/employer-profile" : "/jobseeker-profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign in failed.");
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
      <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <LogIn className="w-12 h-12 text-indigo-400 dark:text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-center text-indigo-400 dark:text-indigo-600 mb-6">
            Sign In to HuntX
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <FancyButton type="submit" className="w-full">
              Sign In
            </FancyButton>
          </form>
          <p className="mt-6 text-center text-gray-300 dark:text-gray-700">
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-400 dark:text-indigo-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;