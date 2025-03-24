import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import JobList from "./pages/JobList";
import PostJob from "./pages/PostJob";
import EmployerProfile from "./pages/EmployerProfile";
import JobSeekerProfile from "./pages/JobSeekerProfile";
import Messaging from "./pages/Messaging";
import NewsFeed from "./pages/NewsFeed";
import CareerTips from "./pages/CareerTips";

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/employer-profile" element={<EmployerProfile />} />
            <Route path="/jobseeker-profile" element={<JobSeekerProfile />} />
            <Route path="/messaging" element={<Messaging />} />
            <Route path="/news-feed" element={<NewsFeed />} />
            <Route path="/career-tips" element={<CareerTips />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;