import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import ConnectButton from "../components/ConnectButton";
import API_BASE_URL from "../config";
import { Search, Briefcase, Building } from "lucide-react";

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ jobs: [], users: [] });

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/featured`);
        setFeaturedJobs(response.data);
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      }
    };

    const fetchTopCompanies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/top-companies`);
        setTopCompanies(response.data);
      } catch (error) {
        console.error("Error fetching top companies:", error);
      }
    };

    fetchFeaturedJobs();
    fetchTopCompanies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const [jobsResponse, usersResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/jobs/list?search=${searchQuery}`),
        token
          ? axios.get(`${API_BASE_URL}/api/users/list`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          : Promise.resolve({ data: [] }),
      ]);

      const filteredUsers = usersResponse.data.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults({
        jobs: jobsResponse.data.jobs,
        users: filteredUsers,
      });
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500 animate-pulse">
            Find Your Dream Job with HuntX
          </h1>
          <p className="text-lg md:text-xl text-gray-300 dark:text-gray-400 mb-8">
            Connect with top employers and job seekers in a professional network.
          </p>
          <form onSubmit={handleSearch} className="flex justify-center mb-8">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for jobs or users..."
                className="w-full p-4 pr-12 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-6 h-6 text-indigo-400 dark:text-indigo-600" />
              </button>
            </div>
          </form>
        </div>

        {searchResults.jobs.length > 0 || searchResults.users.length > 0 ? (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-indigo-400 dark:text-indigo-600">
              Search Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-200 dark:text-gray-700">
                  Jobs
                </h3>
                {searchResults.jobs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {searchResults.jobs.map((job) => (
                      <JobCard key={job._id} job={job} onApply />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-600">No jobs found.</p>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-200 dark:text-gray-700">
                  Users
                </h3>
                {searchResults.users.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {searchResults.users.map((user) => (
                      <div
                        key={user._id}
                        className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex items-center space-x-4">
                          <img
                            src={user.profilePicture || "/default-profile.png"}
                            alt={user.name}
                            className="w-12 h-12 rounded-full border-2 border-indigo-500"
                            onError={(e) => (e.target.src = "/default-profile.png")}
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-indigo-400 dark:text-indigo-600">
                              {user.name}
                            </h3>
                            <p className="text-gray-400 dark:text-gray-600">{user.role}</p>
                            <ConnectButton
                              userId={user._id}
                              initialStatus="none"
                              onAction={() => {}}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-600">No users found.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-indigo-400 dark:text-indigo-600">
                Featured Jobs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredJobs.map((job) => (
                  <JobCard key={job._id} job={job} onApply />
                ))}
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-indigo-400 dark:text-indigo-600">
                Top Companies
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {topCompanies.map((company) => (
                  <div
                    key={company.name}
                    className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-64"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center">
                      <Building className="w-12 h-12 mx-auto mb-4 text-indigo-400 dark:text-indigo-600" />
                      <h3 className="text-xl font-semibold text-indigo-400 dark:text-indigo-600">
                        {company.name}
                      </h3>
                      <p className="text-gray-400 dark:text-gray-600">
                        {company.jobCount} Job{company.jobCount !== 1 ? "s" : ""} Available
                      </p>
                      <Link
                        to={`/jobs?company=${company.name}`}
                        className="mt-4 inline-block text-indigo-400 dark:text-indigo-600 hover:underline"
                      >
                        View Jobs
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="bg-gray-800 dark:bg-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 dark:text-gray-700 mb-4 md:mb-0">
            &copy; 2025 HuntX. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/contact-us"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600"
            >
              Contact Us
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-gray-300 dark:text-gray-700 hover:text-indigo-400 dark:hover:text-indigo-600"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;