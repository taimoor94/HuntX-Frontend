import React from "react";

const ConversationCard = ({ conversation, onClick, isSelected }) => {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const otherParticipant = conversation.participants.find(
    (p) => p._id !== localStorage.getItem("userId")
  );

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
        isSelected ? "bg-indigo-600/50" : "bg-gray-800/50 hover:bg-gray-700/50"
      } backdrop-blur-md border-l-4 ${isSelected ? "border-indigo-500" : "border-transparent"}`}
    >
      <div className="flex items-center space-x-3">
        <img
          src={otherParticipant?.profilePicture || "https://via.placeholder.com/40"}
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-indigo-500"
          onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-indigo-400">
            {otherParticipant?.name || "Unknown User"}
          </h3>
          <p className="text-sm text-gray-400 truncate">
            {lastMessage ? lastMessage.content : "No messages yet"}
          </p>
        </div>
        {lastMessage && (
          <span className="text-xs text-gray-500">
            {new Date(lastMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ConversationCard;