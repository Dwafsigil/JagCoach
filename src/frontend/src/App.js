import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; 
import NavBar from "./components/NavBar/NavBar";
import Upload from "./components/Upload/Upload";
import Feedback from "./components/FeedBack/Feedback";
import Library from "./components/Library/Library";
import Main from "./components/mainpage/main"; 
import AboutUs from "./components/Aboutus/Aboutus";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login"; 
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navRef = useRef(null); 
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("user_id");

  // Middleware to protect pages
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      if (navRef.current) {
        navRef.current.openLoginModal(); 
      }
      return null; 
    }
    return children;
  };

  return (
    <div className="app-container">
      <NavBar ref={navRef} user={currentUser} setUser={setCurrentUser} />

      <div className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Main />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/signup" element={<Signup setCurrentUser={setCurrentUser} />} />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} /> {/* Standalone page optional */}

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />
          <Route path="/library" element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;





