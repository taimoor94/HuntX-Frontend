import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ConnectButton from "../components/ConnectButton";
import API_BASE_URL from "../config";
import { Search, Users } from "lucide-react";

const Connections = () => {
  const { token, userId } = useContext(AuthContext);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/connections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(response.data.connections);
        setPendingRequests(response.data.pendingRequests);
      } catch (error) {
        toast.error("Failed to fetch connections.");
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredUsers = response.data.filter(
        (user) =>
          user._id !== userId &&
          (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filteredUsers);
    } catch (error) {
      toast.error("Failed to search users.");
      console.error("Error searching users:", error);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/${action}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${action} request processed successfully!`);
      // Refresh connections and pending requests
      const response = await axios.get(`${API_BASE_URL}/api/users/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnections(response.data.connections);
      setPendingRequests(response.data.pendingRequests);
    } catch (error) {
      toast.error(`Failed to ${action} request.`);
      console.error(`Error processing ${action} request:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-400 dark:text-indigo-600">
          My Network
        </h1>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-400 dark:text-indigo-600">
            Search Users to Connect
          </h2>
          <form onSubmit={handleSearch} className="flex justify-center mb-8">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for users..."
                className="w-full p-4 pr-12 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-6 h-6 text-indigo-400 dark:text-indigo-600" />
              </button>
            </div>
          </form>
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((user) => (
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
                        initialStatus={
                          connections.some((conn) => conn._id === user._id)
                            ? "connected"
                            : pendingRequests.some(
                                (req) => req._id === user._id && req.status === "pending"
                              )
                            ? "pending"
                            : "none"
                        }
                        onAction={() => {}}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-400 dark:text-indigo-600">
            Pending Connection Requests
          </h2>
          {pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center space-x-4">
                    <img
                      src={req.profilePicture || "/default-profile.png"}
                      alt={req.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-500"
                      onError={(e) => (e.target.src = "/default-profile.png")}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-indigo-400 dark:text-indigo-600">
                        {req.name}
                      </h3>
                      <p className="text-gray-400 dark:text-gray-600">{req.role}</p>
                      <div className="flex space-x-4 mt-2">
                        <button
                          onClick={() => handleAction(req._id, "accept-connection")}
                          className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(req._id, "reject-connection")}
                          className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-600">
              No pending connection requests.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-indigo-400 dark:text-indigo-600">
            My Connections
          </h2>
          {connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((conn) => (
                <div
                  key={conn._id}
                  className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center space-x-4">
                    <img
                      src={conn.profilePicture || "/default-profile.png"}
                      alt={conn.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-500"
                      onError={(e) => (e.target.src = "/default-profile.png")}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-indigo-400 dark:text-indigo-600">
                        {conn.name}
                      </h3>
                      <p className="text-gray-400 dark:text-gray-600">{conn.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-600">
              You have no connections yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;