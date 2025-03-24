import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setRole, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signin`, {
        email,
        password,
      });
      setToken(response.data.token);
      setRole(response.data.role);
      setUserId(response.data.userId);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.userId);
      navigate(response.data.role === "Employer" ? "/employer-profile" : "/jobseeker-profile");
    } catch (error) {
      console.error(error);
      alert("Signin failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 dark:from-gray-100 dark:to-indigo-200 flex items-center justify-center">
      <Navbar />
      <div className="absolute inset-0 bg-[url('/src/assets/background.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10 max-w-md w-full mx-auto mt-20 p-8 bg-gray-800/70 dark:bg-gray-200/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-300 animate-fadeIn">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent">
          Welcome Back to HuntX
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FancyButton type="submit" className="w-full">
            Sign In
          </FancyButton>
        </form>
        <p className="text-center mt-6 text-gray-400 dark:text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-400 dark:text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;