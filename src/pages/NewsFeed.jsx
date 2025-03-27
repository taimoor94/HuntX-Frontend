import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../config";
import { Heart, MessageCircle, Send, Tag, Image as ImageIcon } from "lucide-react";

const NewsFeed = () => {
  const { token, userId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    content: "",
    image: "",
    hashtags: "",
    taggedUsers: [],
  });
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/posts/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        toast.error("Failed to fetch posts.");
        console.error("Error fetching posts:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        toast.error("Failed to fetch users.");
        console.error("Error fetching users:", error);
      }
    };

    fetchPosts();
    fetchUsers();
  }, [token]);

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPost({ ...newPost, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/create`,
        {
          ...newPost,
          taggedUsers: newPost.taggedUsers.map((userId) => userId),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([response.data, ...posts]);
      setNewPost({ content: "", image: "", hashtags: "", taggedUsers: [] });
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post.");
      console.error("Error creating post:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? response.data : post
        )
      );
      toast.success("Post liked/unliked!");
    } catch (error) {
      toast.error("Failed to like/unlike post.");
      console.error("Error liking post:", error);
    }
  };

  const handleCommentChange = (postId, value) => {
    setComment({ ...comment, [postId]: value });
  };

  const handleCommentSubmit = async (postId) => {
    if (!comment[postId]?.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/comment/${postId}`,
        { content: comment[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId ? response.data : post
        )
      );
      setComment({ ...comment, [postId]: "" });
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment.");
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-6 rounded-2xl shadow-2xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-center mb-8 text-indigo-400 dark:text-indigo-600">
              News Feed
            </h1>
            <form onSubmit={handlePostSubmit} className="space-y-6">
              <textarea
                name="content"
                value={newPost.content}
                onChange={handlePostChange}
                placeholder="What's on your mind?"
                className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 h-32"
                required
              />
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                    <ImageIcon className="inline-block w-5 h-5 mr-2" />
                    Add Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  />
                  {newPost.image && (
                    <img
                      src={newPost.image}
                      alt="Preview"
                      className="mt-4 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                    <Tag className="inline-block w-5 h-5 mr-2" />
                    Hashtags
                  </label>
                  <input
                    type="text"
                    name="hashtags"
                    value={newPost.hashtags}
                    onChange={handlePostChange}
                    placeholder="Enter hashtags (comma-separated)"
                    className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
                    Tag Users
                  </label>
                  <select
                    multiple
                    name="taggedUsers"
                    value={newPost.taggedUsers}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        taggedUsers: Array.from(e.target.selectedOptions, (option) => option.value),
                      })
                    }
                    className="w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  >
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300"
              >
                Post
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="relative bg-gray-800/50 dark:bg-gray-200/50 backdrop-blur-lg p-6 rounded-2xl shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={post.author.profilePicture || "/default-profile.png"}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full border-2 border-indigo-500"
                    onError={(e) => (e.target.src = "/default-profile.png")}
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
                <p className="text-gray-200 dark:text-gray-700 mb-4">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {post.taggedUsers.length > 0 && (
                  <p className="text-gray-400 dark:text-gray-600 mb-4">
                    Tagged: {post.taggedUsers.map((user) => user.name).join(", ")}
                  </p>
                )}
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center space-x-2 ${
                      post.likes.includes(userId)
                        ? "text-red-500"
                        : "text-gray-400 dark:text-gray-600"
                    } hover:text-red-500 transition-all duration-300`}
                  >
                    <Heart className="w-6 h-6" />
                    <span>{post.likes.length}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-400 dark:text-gray-600 hover:text-indigo-400 dark:hover:text-indigo-600 transition-all duration-300">
                    <MessageCircle className="w-6 h-6" />
                    <span>{post.comments.length}</span>
                  </button>
                </div>
                <div className="space-y-4 mb-4">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex items-start space-x-4">
                      <img
                        src={comment.author.profilePicture || "/default-profile.png"}
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full border-2 border-indigo-500"
                        onError={(e) => (e.target.src = "/default-profile.png")}
                      />
                      <div>
                        <p className="text-sm font-semibold text-indigo-400 dark:text-indigo-600">
                          {comment.author.name}
                        </p>
                        <p className="text-gray-200 dark:text-gray-700">{comment.content}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-600">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCommentSubmit(post._id);
                  }}
                  className="flex space-x-4"
                >
                  <input
                    type="text"
                    value={comment[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;