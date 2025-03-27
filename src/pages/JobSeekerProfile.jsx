import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import ProfilePictureUploader from "../components/ProfilePictureUploader";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";
import { User, Briefcase } from "lucide-react";

const JobSeekerProfile = () => {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
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
        setProfile(response.data.user);
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
        toast.error("Failed to fetch profile.");
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
        toast.error("Failed to fetch applications.");
        console.error("Error fetching applications:", error);
      }
    };

    fetchProfile();
    fetchApplications();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.user);
      localStorage.setItem("userName", response.data.user.name);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePictureUpload = (profilePicture) => {
    setProfile({ ...profile, profilePicture });
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-6 mb-8">
              <img
                src={profile.profilePicture || "/default-profile.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-indigo-500"
                onError={(e) => (e.target.src = "/default-profile.png")}
              />
              <div>
                <h1 className="text-3xl font-bold text-indigo-400 dark:text-indigo-600">
                  {profile.name}
                </h1>
                <p className="text-gray-400 dark:text-gray-600">{profile.email}</p>
              </div>
            </div>
            <ProfilePictureUploader onUpload={handleProfilePictureUpload} />
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
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
              <InputField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
              />
              <InputField
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="List your skills (comma-separated)"
              />
              <InputField
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Describe your experience"
              />
              <InputField
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Enter your education details"
              />
              <InputField
                label="Portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="Enter your portfolio link"
              />
              <FancyButton type="submit" className="w-full">
                Update Profile
              </FancyButton>
            </form>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-indigo-400 dark:text-indigo-600">
            My Applications
          </h2>
          {applications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-indigo-400 dark:text-indigo-600">
                      {app.job.title}
                    </h3>
                    <p className="text-gray-300 dark:text-gray-700">{app.job.company}</p>
                    <p className="text-gray-400 dark:text-gray-600">
                      Status: {app.status}
                    </p>
                    <p className="text-gray-400 dark:text-gray-600">
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-600">
              No applications yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;