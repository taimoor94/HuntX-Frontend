import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import ConnectionCard from "../components/ConnectionCard";
import API_BASE_URL from "../config";

const EmployerProfile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyInfo: "",
    website: "",
    location: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          companyInfo: response.data.user.companyInfo || "",
          website: response.data.user.website || "",
          location: response.data.user.location || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/my-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchConnections = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/connections/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(response.data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchProfile();
    fetchJobs();
    fetchConnections();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-12 p-8 bg-gray-800/70 dark:bg-gray-200/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-300 animate-fadeIn">
        <div className="flex items-center space-x-6 mb-8">
          <img
            src={user.profilePicture || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-indigo-500"
            onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
          />
          <div>
            <h2 className="text-3xl font-bold text-indigo-400 dark:text-indigo-600">{user.name}</h2>
            <p className="text-gray-400 dark:text-gray-600">{user.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                Company Info
              </label>
              <textarea
                name="companyInfo"
                value={formData.companyInfo}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                rows="4"
                placeholder="Tell us about your company..."
              />
            </div>
            <InputField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://yourcompany.com"
            />
            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., San Francisco, CA"
            />
            <div className="flex space-x-4">
              <FancyButton type="submit">Save</FancyButton>
              <FancyButton
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </FancyButton>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-2">
                  Company Info
                </h3>
                <p className="text-gray-300 dark:text-gray-700">{user.companyInfo || "Not provided"}</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-2">
                  Website
                </h3>
                <p className="text-gray-300 dark:text-gray-700">
                  {user.website ? (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 dark:text-indigo-600 hover:underline"
                    >
                      {user.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-2">
                  Location
                </h3>
                <p className="text-gray-300 dark:text-gray-700">{user.location || "Not provided"}</p>
              </div>
              <FancyButton onClick={() => setIsEditing(true)}>Edit Profile</FancyButton>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-4">
                Posted Jobs
              </h3>
              {jobs.length === 0 ? (
                <p className="text-gray-400 dark:text-gray-600">You haven't posted any jobs yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                      <h4 className="text-xl font-semibold text-indigo-400 dark:text-indigo-600 relative z-10">
                        {job.title}
                      </h4>
                      <p className="text-gray-300 dark:text-gray-700 relative z-10">{job.company}</p>
                      <p className="text-gray-400 dark:text-gray-600 relative z-10">
                        {job.location} - {job.jobType}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-4">
                Connections
              </h3>
              {connections.length === 0 ? (
                <p className="text-gray-400 dark:text-gray-600">You have no connections yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {connections.map((connection) => (
                    <ConnectionCard
                      key={connection._id}
                      connection={connection}
                      onAction={() => {
                        const fetchConnections = async () => {
                          const response = await axios.get(`${API_BASE_URL}/api/connections/list`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          setConnections(response.data);
                        };
                        fetchConnections();
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;