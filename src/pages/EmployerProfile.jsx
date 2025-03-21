import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const EmployerProfile = () => {
  const [jobs, setJobs] = useState([]);
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== "Employer") {
      navigate("/signin");
      return;
    }

    const fetchJobs = async () => {
      try {
        // Decode the token to get the user ID
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id; // Extract user ID from token

        // Fetch all jobs
        const response = await axios.get("http://localhost:5000/api/jobs/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Log the response for debugging
        console.log("Fetched jobs:", response.data.jobs);

        // Filter jobs posted by the current employer
        const employerJobs = response.data.jobs.filter((job) => {
          const postedById = job.postedBy._id.toString(); // Ensure string comparison
          return postedById === userId;
        });

        // Log the filtered jobs for debugging
        console.log("Filtered employer jobs:", employerJobs);

        setJobs(employerJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [token, role, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-12 p-6">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Employer Profile - HuntX
        </h2>
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/post-job")}
            className="bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:shadow-lg transition duration-300"
          >
            Post a New Job
          </button>
        </div>
        <h3 className="text-2xl font-semibold mb-4">Your Posted Jobs</h3>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600">You haven't posted any jobs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-primary"
              >
                <h3 className="text-2xl font-semibold text-primary mb-2">{job.title}</h3>
                <p className="text-gray-700 font-medium">{job.company}</p>
                <p className="text-gray-600 mt-2">{job.description}</p>
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Hourly Rate:</span> ${job.hourlyRate}/hr
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Location:</span> {job.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Type:</span> {job.jobType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;