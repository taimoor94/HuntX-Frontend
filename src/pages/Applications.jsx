import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../config";
import { User, Briefcase, CheckCircle, XCircle } from "lucide-react";

const Applications = () => {
  const { token, role } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (role !== "Employer") {
        toast.error("Only employers can view applications.");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/employer-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (error) {
        toast.error("Failed to fetch applications.");
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [token, role]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/jobs/application-status/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: response.data.status } : app
        )
      );
      toast.success(`Application ${status.toLowerCase()}!`);
    } catch (error) {
      toast.error(`Failed to ${status.toLowerCase()} application.`);
      console.error(`Error updating application status to ${status}:`, error);
    }
  };

  if (role !== "Employer") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-400 dark:text-gray-600">
            Only employers can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-400 dark:text-indigo-600">
          Job Applications
        </h1>
        <div className="space-y-8">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div
                key={app._id}
                className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-6 rounded-2xl shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={app.applicant.profilePicture || "/default-profile.png"}
                      alt={app.applicant.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-500"
                      onError={(e) => (e.target.src = "/default-profile.png")}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-400 dark:text-indigo-600">
                        {app.applicant.name}
                      </h3>
                      <p className="text-gray-400 dark:text-gray-600">{app.applicant.email}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-indigo-400 dark:text-indigo-600" />
                      <p className="text-gray-200 dark:text-gray-700">
                        Applied for: {app.job.title} at {app.job.company}
                      </p>
                    </div>
                    <p className="text-gray-400 dark:text-gray-600">
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 dark:text-gray-600">
                      Status: {app.status}
                    </p>
                  </div>
                  {app.status === "Pending" && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleStatusUpdate(app._id, "Accepted")}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-300"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app._id, "Rejected")}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-600">
              No applications received yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;