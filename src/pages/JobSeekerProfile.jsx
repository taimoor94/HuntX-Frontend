import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import ConnectionCard from "../components/ConnectionCard";
import API_BASE_URL from "../config";

const JobSeekerProfile = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [applications, setApplications] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
    experience: "",
    education: "",
    portfolio: "",
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
          bio: response.data.user.bio || "",
          skills: response.data.user.skills || "",
          experience: response.data.user.experience || "",
          education: response.data.user.education || "",
          portfolio: response.data.user.portfolio || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
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
    fetchApplications();
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
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
            <InputField
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              placeholder="e.g., JavaScript, Python, Project Management"
            />
            <div>
              <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                Experience
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                rows="4"
                placeholder="Describe your work experience..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                Education
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                rows="4"
                placeholder="List your educational qualifications..."
              />
            </div>
            <InputField
              label="Portfolio URL"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="https://yourportfolio.com"
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
                  Bio
                </h3>
                <p className="text-gray-300 dark:text-gray-700">{user.bio || "Not provided"}</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-2">
                  Skills
                </h3>
                <p className="text-gray-300 dark:text-gray-700">{user.skills || "Not provided"}</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-2">
                  Experience
                </h3>
                <p className="text-gray-300 dark:text-gray-700">{user.experience || "Not provided"}</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-2">
                  Education
                </h3>
                <p className="text-gray-300 dark:text-gray-700">{user.education || "Not provided"}</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-2">
                  Portfolio
                </h3>
                <p className="text-gray-300 dark:text-gray-700">
                  {user.portfolio ? (
                    <a
                      href={user.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 dark:text-indigo-600 hover:underline"
                    >
                      {user.portfolio}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
              <FancyButton onClick={() => setIsEditing(true)}>Edit Profile</FancyButton>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600 mb-4">
                Job Applications
              </h3>
              {applications.length === 0 ? (
                <p className="text-gray-400 dark:text-gray-600">You haven't applied to any jobs yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                      <h4 className="text-xl font-semibold text-indigo-400 dark:text-indigo-600 relative z-10">
                        {app.job.title}
                      </h4>
                      <p className="text-gray-300 dark:text-gray-700 relative z-10">{app.job.company}</p>
                      <p className="text-gray-400 dark:text-gray-600 relative z-10">
                        {app.job.location} - {app.job.jobType}
                      </p>
                      <p className="text-gray-400 dark:text-gray-600 relative z-10">Status: {app.status}</p>
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

export default JobSeekerProfile;