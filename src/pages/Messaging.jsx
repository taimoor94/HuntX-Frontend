import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import Navbar from "../components/Navbar";
import ConversationCard from "../components/ConversationCard";
import API_BASE_URL from "../config";
import { Send, Search } from "lucide-react";

const Messaging = () => {
  const { token, userId } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(response.data);
        setFilteredConversations(response.data);
      } catch (error) {
        toast.error("Failed to fetch conversations.");
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === newMessage.conversationId
              ? { ...conv, messages: [...conv.messages, newMessage] }
              : conv
          )
        );
        setFilteredConversations((prev) =>
          prev.map((conv) =>
            conv._id === newMessage.conversationId
              ? { ...conv, messages: [...conv.messages, newMessage] }
              : conv
          )
        );
      });

      if (selectedConversation) {
        socket.emit("joinConversation", selectedConversation._id);
      }

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, selectedConversation]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    const filtered = conversations.filter((conv) => {
      const otherParticipant = conv.participants.find((p) => p._id !== userId);
      return otherParticipant?.name.toLowerCase().includes(query);
    });
    setFilteredConversations(filtered);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages/send`,
        {
          conversationId: selectedConversation._id,
          content: message,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMessage = response.data;
      socket.emit("sendMessage", {
        ...newMessage,
        conversationId: selectedConversation._id,
        sender: { _id: userId, name: localStorage.getItem("userName") },
        recipientId: selectedConversation.participants.find((p) => p._id !== userId)._id,
      });

      setMessage("");
    } catch (error) {
      toast.error("Failed to send message.");
      console.error("Error sending message:", error);
    }
  };

  const startConversation = async (recipientId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/messages/start`,
        { recipientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversations((prev) => [...prev, response.data]);
      setFilteredConversations((prev) => [...prev, response.data]);
      setSelectedConversation(response.data);
    } catch (error) {
      toast.error("Failed to start conversation.");
      console.error("Error starting conversation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-400 dark:text-indigo-600">
          Messages
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-6 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
            <div className="relative z-10">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users to chat..."
                    className="w-full p-4 pr-12 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Search className="w-6 h-6 text-indigo-400 dark:text-indigo-600" />
                  </button>
                </div>
              </form>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <ConversationCard
                    key={conv._id}
                    conversation={conv}
                    onClick={() => setSelectedConversation(conv)}
                    isSelected={selectedConversation?._id === conv._id}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-6 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
            <div className="relative z-10">
              {selectedConversation ? (
                <>
                  <h2 className="text-2xl font-semibold mb-6 text-indigo-400 dark:text-indigo-600">
                    Chat with{" "}
                    {selectedConversation.participants.find((p) => p._id !== userId)?.name}
                  </h2>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto mb-6">
                    {selectedConversation.messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${
                          msg.sender._id === userId ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs p-4 rounded-lg ${
                            msg.sender._id === userId
                              ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                              : "bg-gray-700 dark:bg-gray-300 text-gray-200 dark:text-gray-900"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300"
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </form>
                </>
              ) : (
                <p className="text-center text-gray-400 dark:text-gray-600">
                  Select a conversation to start chatting.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;