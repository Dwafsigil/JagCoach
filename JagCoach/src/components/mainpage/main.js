import React from "react";
import "./main.css"; 

function Main() {
  return (
    <div className="home-container">
        <div className="home-content">
      {/* <img src="/JagCoach.png" alt="JagCoach Logo" className="main-logo" /> */}
      <h1>Welcome to JagCoach</h1>
      <p className="intro-text">
        JagCoach helps you improve your presentation skills through AI-powered feedback.
        Upload your video, receive insights, and enhance your presentation abilities.
      </p>
      <h2>Are you ready to start now? </h2>

      <div className="cta-buttons">
        <button onClick={() => window.location.href = "/dashboard"}>Upload Video</button>
        <button onClick={() => window.location.href = "/library"}>View Library</button>
      </div>
    </div>
    </div>
  );
}

export default Main;