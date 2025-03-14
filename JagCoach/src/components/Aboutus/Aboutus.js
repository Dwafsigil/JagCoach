import React from "react";
import "./Aboutus.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <div className="grid-container">
        {[
          { title: "Our Mission", content: "JagCoach helps individuals improve their presentation skills through AI-powered feedback." },
          { title: "How It Works", content: "Upload your presentation video, and our AI analyzes clarity, confidence, and engagement." },
          { title: "Why Choose JagCoach?", content: "Our platform provides insightful feedback tailored to your speaking style." },
          { title: "AI Analysis", content: "Our AI evaluates pacing, pronunciation, and delivery for improvement." },
          { title: "Personalized Feedback", content: "Receive tailored suggestions based on your unique presentation style." },
          { title: "Continuous Learning", content: "Track your progress and refine your presentation skills over time." }
        ].map((box, index) => (
          <div key={index} className="info-box">
            <h2>{box.title}</h2>
            <p>{box.content}</p>
          </div>
        ))}
      </div>

      {/* Our Team Section */}
      <div className="team-section">
        <h2>Our Team</h2>
        <p>Meet the talented individuals behind JagCoach - Team 2!</p>

        <div className="team-container">
          {[
            { name: "Johnny Tu", role: "Team Leader, BackEnd" },
            { name: "Charidi Stevens", role: "FrontEnd" },
            { name: "David Ludemann", role: "BackEnd" },
            { name: "Charisma Ricarte", role: "BackEnd" },
            { name: "Bao Phuc Nguyen", role: "BackEnd, FrontEnd" },
            { name: "Jakarria Wilcox", role: "Project Manager, Frontend" }
          ].map((member, index) => (
            <div key={index} className="team-box">
              <strong>{member.name}</strong>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
