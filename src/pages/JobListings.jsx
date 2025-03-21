import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ jobType: "", location: "" });
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs/list", {
          params: { search: searchQuery, ...filters, page, limit },
        });
        setJobs(response.data.jobs);
        setTotal(response.data.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchQuery, filters, page, limit]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to first page on filter change
  };

  const handleApply = async (jobId) => {
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/jobs/apply",
        { jobId, resume: "https://example.com/resume.pdf", coverLetter: "Interested in this role!" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Application submitted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply!");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-12 p-6">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Explore Job Opportunities
        </h2>

        {/* Filters */}
        <div className="flex justify-between mb-8 space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">Job Type</label>
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="w-full p-3 rounded-lg bg-gray-50 shadow-inner border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g., Remote, New York"
              className="w-full p-3 rounded-lg bg-gray-50 shadow-inner border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
            />
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No jobs found. Try adjusting your filters!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border-l-4 border-primary fade-in"
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
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Posted by:</span> {job.postedBy.name}
                  </p>
                </div>
                <button
                  onClick={() => handleApply(job._id)}
                  className="mt-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-300"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;