import React from "react";
import "./Aboutus.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="grid-container">
        <div className="info-box">
          <h2>Our Mission</h2>
          <p>JagCoach helps individuals improve their presentation skills through AI-powered feedback.</p>
        </div>

        <div className="info-box">
          <h2>How It Works</h2>
          <p>Upload your presentation video, and our AI analyzes clarity, confidence, and engagement.</p>
        </div>

        <div className="info-box">
          <h2>Why Choose JagCoach?</h2>
          <p>Our platform provides insightful feedback tailored to your speaking style.</p>
        </div>

        <div className="info-box">
          <h2>AI Analysis</h2>
          <p>Our AI evaluates pacing, pronunciation, and delivery for improvement.</p>
        </div>

        <div className="info-box">
          <h2>Personalized Feedback</h2>
          <p>Receive tailored suggestions based on your unique presentation style.</p>
        </div>

        <div className="info-box">
          <h2>Continuous Learning</h2>
          <p>Track your progress and refine your presentation skills over time.</p>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="team-section">
        <h2>Our Team</h2>
        <p>Meet the talented individuals behind JagCoach - Team 2!</p>

        <div className="team-container">
          <div className="team-box">
            <strong>Johnny Tu</strong>
            <p>Team Leader, BackEnd</p>
          </div>

          <div className="team-box">
            <strong>Charidi Stevens</strong>
            <p>FrontEnd</p>
          </div>

          <div className="team-box">
            <strong>David Ludemann</strong>
            <p>BackEnd</p>
          </div>

          <div className="team-box">
            <strong>Charisma Ricarte</strong>
            <p>BackEnd, FrontEnd</p>
          </div>

          <div className="team-box">
            <strong>Bao Phuc Nguyen</strong>
            <p>BackEnd, FrontEnd</p>
          </div>

          <div className="team-box">
            <strong>Jakarri</strong>
            <p>Project Manager</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
