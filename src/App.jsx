import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import JobListings from "./pages/JobListings";
import PostJob from "./pages/PostJob";
import CareerTips from "./pages/CareerTips";
import EmployerProfile from "./pages/EmployerProfile";
import JobSeekerProfile from "./pages/JobSeekerProfile";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/career-tips" element={<CareerTips />} />
          <Route path="/employer-profile" element={<EmployerProfile />} />
          <Route path="/jobseeker-profile" element={<JobSeekerProfile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;