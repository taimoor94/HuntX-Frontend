import React from "react";
import ConnectButton from "./ConnectButton";

const ConnectionCard = ({ connection, onAction }) => {
  return (
    <div className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 flex items-center space-x-4">
        <img
          src={connection.profilePicture || "/default-profile.png"}
          alt={connection.name}
          className="w-12 h-12 rounded-full border-2 border-indigo-500"
          onError={(e) => (e.target.src = "/default-profile.png")}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-indigo-400 dark:text-indigo-600">{connection.name}</h3>
          <p className="text-gray-400 dark:text-gray-600">{connection.role}</p>
          <ConnectButton userId={connection._id} initialStatus={connection.status} onAction={onAction} />
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;