import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const JobSeekerProfile = () => {
  const [applications, setApplications] = useState([]);
  const [resume, setResume] = useState("");
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== "Job Seeker") {
      navigate("/signin");
      return;
    }

    const fetchApplications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [token, role, navigate]);

  const handleResumeUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/jobs/apply",
        { jobId: applications[0]?.jobId, resume, coverLetter: "Updated resume" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Resume updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update resume!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-12 p-6">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Job Seeker Profile - HuntX
        </h2>

        {/* Resume Update Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Update Your Resume</h3>
          <form onSubmit={handleResumeUpdate} className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter new resume URL"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-50 shadow-inner border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:shadow-lg transition duration-300"
            >
              Update Resume
            </button>
          </form>
        </div>

        {/* Applications Section */}
        <h3 className="text-2xl font-semibold mb-4">Your Applications</h3>
        {applications.length === 0 ? (
          <p className="text-center text-gray-600">You haven't applied to any jobs yet.</p>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-l-4 border-primary"
              >
                <h3 className="text-xl font-semibold text-primary">{app.jobId.title}</h3>
                <p className="text-gray-700">{app.jobId.company}</p>
                <p className="text-gray-600 mt-2">Resume: <a href={app.resume} className="text-primary hover:underline">{app.resume}</a></p>
                <p className="text-gray-600">Cover Letter: {app.coverLetter || "N/A"}</p>
                <p className="text-gray-600">
                  Interview: {app.interviewScheduled ? `Scheduled for ${new Date(app.interviewDate).toLocaleDateString()}` : "Not scheduled"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerProfile;