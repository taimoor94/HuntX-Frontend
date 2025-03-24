import React, { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import FancyButton from "./FancyButton";
import API_BASE_URL from "../config";
import { toast } from "react-hot-toast";

const ConnectionCard = ({ connection, onAction }) => {
  const { token } = useContext(AuthContext);

  const handleAction = async (action) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/connections/${action}`,
        { userId: connection._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`${action} request processed successfully!`);
      onAction();
    } catch (error) {
      toast.error(`Failed to ${action} connection.`);
      console.error(error);
    }
  };

  return (
    <div className="relative bg-gray-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 flex items-center space-x-4">
        <img
          src={connection.profilePicture || "https://via.placeholder.com/40"}
          alt={connection.name}
          className="w-10 h-10 rounded-full border-2 border-indigo-500"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-indigo-400">{connection.name}</h3>
          <p className="text-sm text-gray-400">{connection.role}</p>
        </div>
        {connection.status === "pending" ? (
          <FancyButton
            onClick={() => handleAction("accept")}
            className="bg-green-600 hover:bg-green-700"
          >
            Accept
          </FancyButton>
        ) : connection.status === "connected" ? (
          <FancyButton
            onClick={() => handleAction("remove")}
            className="bg-red-600 hover:bg-red-700"
          >
            Remove
          </FancyButton>
        ) : (
          <FancyButton onClick={() => handleAction("connect")}>Connect</FancyButton>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;