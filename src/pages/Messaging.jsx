import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import Navbar from "../components/Navbar";
import ConversationCard from "../components/ConversationCard";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";

const Messaging = () => {
  const { token, userId } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [newConversationUser, setNewConversationUser] = useState("");
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchConversations();
    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv._id === message.conversationId
              ? { ...conv, messages: [...conv.messages, message] }
              : conv
          )
        );
        if (selectedConversation?._id === message.conversationId) {
          setSelectedConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
          }));
        }
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedConversation || !messageContent.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages/send`,
        {
          conversationId: selectedConversation._id,
          content: messageContent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newMessage = response.data;
      setConversations(
        conversations.map((conv) =>
          conv._id === selectedConversation._id
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        )
      );
      setSelectedConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
      socket.emit("sendMessage", newMessage);
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleStartConversation = async (e) => {
    e.preventDefault();
    if (!newConversationUser) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages/start`,
        { recipientId: newConversationUser },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConversations([...conversations, response.data]);
      setNewConversationUser("");
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-12 p-8 bg-gray-800/70 dark:bg-gray-200/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-300 animate-fadeIn">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent">
          Messages
        </h2>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 space-y-4">
            <form onSubmit={handleStartConversation} className="mb-6">
              <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                Start a New Conversation
              </label>
              <select
                value={newConversationUser}
                onChange={(e) => setNewConversationUser(e.target.value)}
                className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              <FancyButton type="submit" className="mt-4 w-full">
                Start Conversation
              </FancyButton>
            </form>
            {conversations.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-600">No conversations yet.</p>
            ) : (
              conversations.map((conv) => (
                <ConversationCard
                  key={conv._id}
                  conversation={conv}
                  onClick={() => setSelectedConversation(conv)}
                  isSelected={selectedConversation?._id === conv._id}
                />
              ))
            )}
          </div>

          {/* Chat Area */}
          <div className="w-full md:w-2/3 bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl">
            {selectedConversation ? (
              <>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={
                      selectedConversation.participants.find((p) => p._id !== userId)?.profilePicture ||
                      "https://via.placeholder.com/40"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                  />
                  <h3 className="text-2xl font-semibold text-indigo-400 dark:text-indigo-600">
                    Chat with{" "}
                    {selectedConversation.participants.find((p) => p._id !== userId)?.name ||
                      "Unknown User"}
                  </h3>
                </div>
                <div className="h-96 overflow-y-auto space-y-4 mb-4">
                  {selectedConversation.messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.sender === userId ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-4 rounded-lg ${
                          msg.sender === userId
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 dark:bg-gray-400 text-gray-300 dark:text-gray-900"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                  <InputField
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <FancyButton type="submit">Send</FancyButton>
                </form>
              </>
            ) : (
              <p className="text-gray-400 dark:text-gray-600 text-center">
                Select a conversation to start chatting.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;