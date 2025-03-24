import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const locationHook = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      const params = new URLSearchParams(locationHook.search);
      const search = params.get("search") || "";
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/list`, {
          params: { search, jobType, location, page, limit },
        });
        setJobs(response.data.jobs);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [locationHook.search, jobType, location, page, limit]);

  const handleFilterChange = () => {
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent animate-fadeIn">
          Job Listings
        </h2>

        <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-200 mb-2">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                handleFilterChange();
              }}
              className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <InputField
            label="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              handleFilterChange();
            }}
            placeholder="e.g., New York"
          />
        </div>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-400">No jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {total > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            <FancyButton
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </FancyButton>
            <span className="px-4 py-2 text-gray-300">
              Page {page} of {totalPages}
            </span>
            <FancyButton
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </FancyButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;