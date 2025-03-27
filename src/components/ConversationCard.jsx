import React from "react";

const ConversationCard = ({ conversation, onClick, isSelected }) => {
  const otherParticipant = conversation.participants.find((p) => p._id !== localStorage.getItem("userId"));

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
        isSelected
          ? "bg-indigo-600 dark:bg-indigo-500 text-white"
          : "bg-gray-800/50 dark:bg-gray-300/50 hover:bg-gray-700/50 dark:hover:bg-gray-400/50"
      }`}
    >
      <img
        src={otherParticipant?.profilePicture || "/default-profile.png"}
        alt={otherParticipant?.name}
        className="w-10 h-10 rounded-full border-2 border-indigo-500"
        onError={(e) => (e.target.src = "/default-profile.png")}
      />
      <div>
        <p className={`font-semibold ${isSelected ? "text-white" : "text-indigo-400 dark:text-indigo-600"}`}>
          {otherParticipant?.name || "Unknown User"}
        </p>
        <p className={`text-sm ${isSelected ? "text-gray-200" : "text-gray-400 dark:text-gray-600"}`}>
          {conversation.messages.length > 0
            ? conversation.messages[conversation.messages.length - 1].content.slice(0, 20) + "..."
            : "No messages yet"}
        </p>
      </div>
    </div>
  );
};

export default ConversationCard;