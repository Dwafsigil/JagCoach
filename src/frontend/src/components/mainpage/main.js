import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./main.css";

function Main() {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      navigate("/dashboard");
    } else {
      // Trigger login modal opening
      const loginButton = document.querySelector(".login-button");
      if (loginButton) {
        loginButton.click(); // Simulate click to open login modal
      }
    }
  };

  const handleViewLibraryClick = () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      navigate("/library");
    } else {
      const loginButton = document.querySelector(".login-button");
      if (loginButton) {
        loginButton.click(); // Simulate click to open login modal
      }
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to JagCoach</h1>
        <p className="intro-text">
          JagCoach helps you improve your presentation skills through AI-powered feedback.
          Upload your video, receive insights, and enhance your presentation abilities.
        </p>
        <h2>Are you ready to start now?</h2>

        <div className="cta-buttons">
          <button onClick={handleUploadClick}>Upload Video</button>
          <button onClick={handleViewLibraryClick}>View Library</button>
        </div>
      </div>
    </div>
  );
}

export default Main;
