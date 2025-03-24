import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Connections = () => {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users.filter((u) => u._id !== user._id));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchConnections = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/connections/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(response.data.connections);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    if (token) {
      fetchUsers();
      fetchConnections();
    }
  }, [token, user]);

  const handleConnect = async (userId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/connections/connect",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Connection request sent!");
      setConnections([...connections, { userId, status: "pending" }]);
    } catch (error) {
      toast.error("Failed to send connection request.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-12 p-6">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Connections - HuntX
        </h2>
        <h3 className="text-2xl font-semibold mb-4">Suggested Connections</h3>
        <div className="space-y-6">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={u.profilePicture || "https://via.placeholder.com/32"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
                <div>
                  <p className="font-semibold text-gray-800">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
              </div>
              {connections.find((c) => c.userId === u._id) ? (
                <p className="text-gray-600">
                  {connections.find((c) => c.userId === u._id).status === "pending"
                    ? "Pending"
                    : "Connected"}
                </p>
              ) : (
                <button
                  onClick={() => handleConnect(u._id)}
                  className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-300"
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;