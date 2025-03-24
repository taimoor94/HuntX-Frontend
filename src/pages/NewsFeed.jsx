import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import FancyButton from "../components/FancyButton";
import API_BASE_URL from "../config";

const NewsFeed = () => {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/posts/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [token]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/create`,
        { content: newPost },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts([response.data, ...posts]);
      setNewPost("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-12 p-8 bg-gray-800/70 dark:bg-gray-200/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-300 animate-fadeIn">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 bg-clip-text text-transparent">
          News Feed
        </h2>

        <form onSubmit={handleCreatePost} className="mb-8">
          <InputField
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="mb-4"
          />
          <FancyButton type="submit" className="w-full">
            Post
          </FancyButton>
        </form>

        {posts.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-600 text-center">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="relative bg-gray-800/50 dark:bg-gray-300/50 backdrop-blur-md p-6 rounded-xl shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center space-x-4 relative z-10">
                  <img
                    src={post.author.profilePicture || "https://via.placeholder.com/40"}
                    alt="Author"
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-400 dark:text-indigo-600">
                      {post.author.name}
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-600">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-300 dark:text-gray-700 relative z-10">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;