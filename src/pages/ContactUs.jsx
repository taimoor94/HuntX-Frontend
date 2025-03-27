import React, { useState } from "react";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic (e.g., send email via API)
    console.log("Contact form submitted:", formData);
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-400 dark:text-indigo-600">
          Contact Us
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-6 text-indigo-400 dark:text-indigo-600">
                Get in Touch
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
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
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message"
                    className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 h-32"
                    required
                  />
                </div>
                <FancyButton type="submit" className="w-full">
                  Send Message
                </FancyButton>
              </form>
            </div>
          </div>
          <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-6 text-indigo-400 dark:text-indigo-600">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-indigo-400 dark:text-indigo-600" />
                  <p className="text-gray-200 dark:text-gray-700">
                    Email: support@huntx.com
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-indigo-400 dark:text-indigo-600" />
                  <p className="text-gray-200 dark:text-gray-700">
                    Phone: +1 (555) 123-4567
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-indigo-400 dark:text-indigo-600" />
                  <p className="text-gray-200 dark:text-gray-700">
                    Address: 123 HuntX Street, Tech City, USA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;