import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import API_BASE_URL from "../config";
import { Search, Filter } from "lucide-react";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    jobType: "",
    location: "",
    company: new URLSearchParams(window.location.search).get("company") || "",
    page: 1,
    limit: 9,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const query = new URLSearchParams({
          search: filters.search,
          jobType: filters.jobType,
          location: filters.location,
          company: filters.company,
          page: filters.page,
          limit: filters.limit,
        }).toString();
        const response = await axios.get(`${API_BASE_URL}/api/jobs/list?${query}`);
        setJobs(response.data.jobs);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(total / filters.limit)) return;
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-400 dark:text-indigo-600">
          Job Listings
        </h1>

        <div className="mb-8 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search jobs..."
              className="w-full p-4 pr-12 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-indigo-400 dark:text-indigo-600" />
          </div>
          <div className="flex space-x-4">
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            >
              <option value="">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              className="p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />
            <input
              type="text"
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              placeholder="Company"
              className="p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onApply />
          ))}
        </div>

        {total > 0 && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300"
            >
              Previous
            </button>
            <span className="text-gray-300 dark:text-gray-700">
              Page {filters.page} of {Math.ceil(total / filters.limit)}
            </span>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === Math.ceil(total / filters.limit)}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;