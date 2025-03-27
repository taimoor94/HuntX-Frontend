import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../config";
import { UserPlus, UserMinus, UserCheck } from "lucide-react";

const ConnectButton = ({ userId: targetUserId, initialStatus, onAction }) => {
  const { token, userId } = useContext(AuthContext);
  const [status, setStatus] = useState(initialStatus || "none");

  const handleConnect = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/connections/connect`,
        { userId: targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("pending");
      toast.success("Connection request sent!");
      onAction();
    } catch (error) {
      toast.error("Failed to send connection request.");
      console.error(error);
    }
  };

  const handleAccept = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/connections/accept`,
        { userId: targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("connected");
      toast.success("Connection accepted!");
      onAction();
    } catch (error) {
      toast.error("Failed to accept connection.");
      console.error(error);
    }
  };

  const handleRemove = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/connections/remove`,
        { userId: targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("none");
      toast.success("Connection removed!");
      onAction();
    } catch (error) {
      toast.error("Failed to remove connection.");
      console.error(error);
    }
  };

  if (targetUserId === userId) return null;

  return (
    <div className="mt-2">
      {status === "none" && (
        <button
          onClick={handleConnect}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Connect
        </button>
      )}
      {status === "pending" && (
        <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg cursor-not-allowed">
          <UserPlus className="w-5 h-5 mr-2" />
          Pending
        </button>
      )}
      {status === "connected" && (
        <button
          onClick={handleRemove}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
        >
          <UserMinus className="w-5 h-5 mr-2" />
          Disconnect
        </button>
      )}
      {status === "incoming" && (
        <button
          onClick={handleAccept}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          <UserCheck className="w-5 h-5 mr-2" />
          Accept
        </button>
      )}
    </div>
  );
};

export default ConnectButton;