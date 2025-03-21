import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token, setToken } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${search}`);
  };

  return (
    <nav className="bg-bgDark shadow-xl py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        HuntX
      </h1>
      <div className="flex items-center space-x-6">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <button type="submit" className="absolute right-2 top-2 text-primary">🔍</button>
        </form>
        <a href="/" className="text-white hover:text-primary transition duration-300 font-semibold">Home</a>
        <a href="/jobs" className="text-white hover:text-primary transition duration-300 font-semibold">Jobs</a>
        {token ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-white hover:text-primary transition duration-300 font-semibold"
            >
              My Account
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                <a
                  href="/post-job"
                  className="block px-4 py-2 text-gray-800 hover:bg-primary hover:text-white transition duration-300"
                >
                  Post Job
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-primary hover:text-white transition duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <a href="/signin" className="text-white hover:text-primary transition duration-300 font-semibold">Sign In</a>
            <a href="/signup" className="text-primary font-semibold px-4 py-2 rounded-lg bg-white shadow-md hover:bg-primary hover:text-white transition duration-300">
              Sign Up
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;