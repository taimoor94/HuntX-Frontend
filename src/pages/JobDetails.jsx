import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";
import { Briefcase, MapPin, DollarSign, Clock, Building } from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/list/${id}`);
        setJob(response.data);
      } catch (error) {
        toast.error("Failed to fetch job details.");
        console.error("Error fetching job:", error);
      }
    };

    const checkApplicationStatus = async () => {
      if (token && role === "Job Seeker") {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/jobs/my-applications`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const applied = response.data.some((app) => app.job._id === id);
          setHasApplied(applied);
        } catch (error) {
          console.error("Error checking application status:", error);
        }
      }
    };

    fetchJob();
    checkApplicationStatus();
  }, [id, token, role]);

  const handleApply = async () => {
    if (!token) {
      toast.error("Please sign in to apply for this job.");
      navigate("/signin");
      return;
    }

    if (role !== "Job Seeker") {
      toast.error("Only job seekers can apply for jobs.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/jobs/apply/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply for job.");
      console.error("Error applying for job:", error);
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 text-indigo-400 dark:text-indigo-600">
              {job.title}
            </h1>
            <div className="flex items-center space-x-4 mb-6">
              <Building className="w-6 h-6 text-indigo-400 dark:text-indigo-600" />
              <p className="text-gray-200 dark:text-gray-700">{job.company}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-indigo-400 dark:text-indigo-600" />
                <p className="text-gray-200 dark:text-gray-700">{job.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-indigo-400 dark:text-indigo-600" />
                <p className="text-gray-200 dark:text-gray-700">${job.hourlyRate}/hr</p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-400 dark:text-indigo-600" />
                <p className="text-gray-200 dark:text-gray-700">{job.jobType}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-400 dark:text-indigo-600" />
                <p className="text-gray-200 dark:text-gray-700">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-indigo-400 dark:text-indigo-600">
                Description
              </h2>
              <p className="text-gray-200 dark:text-gray-700">{job.description}</p>
            </div>
            {job.requirements && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-indigo-400 dark:text-indigo-600">
                  Requirements
                </h2>
                <p className="text-gray-200 dark:text-gray-700">{job.requirements}</p>
              </div>
            )}
            {job.benefits && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-indigo-400 dark:text-indigo-600">
                  Benefits
                </h2>
                <p className="text-gray-200 dark:text-gray-700">{job.benefits}</p>
              </div>
            )}
            {role === "Job Seeker" && (
              <FancyButton
                onClick={handleApply}
                disabled={hasApplied}
                className="w-full"
              >
                {hasApplied ? "Applied" : "Apply Now"}
              </FancyButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;