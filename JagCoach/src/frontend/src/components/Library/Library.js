import React, { useState } from "react";
import "./Library.css";

const Resource = () => {
  // Simulated uploaded videos with multiple AI feedback categories
  const [videos] = useState([
    {
      id: 1,
      title: "Project Presentation",
      description: "Demo video.",
      feedback: [
        { category: "Clarity", comment: "Your speech was clear and well-paced." },
        { category: "Engagement", comment: "Good eye contact and enthusiasm in your tone." },
        { category: "Confidence", comment: "You appeared confident, but avoid too many filler words." }
      ]
    },
    {
      id: 2,
      title: "Project Presentation 2",
      description: "Demo video.",
      feedback: [
        { category: "Clarity", comment: "Try to enunciate words more clearly." },
        { category: "Pacing", comment: "Slow down slightly for better comprehension." },
        { category: "Pronunciation", comment: "Some words were mispronounced; try slowing down." }
      ]
    },
    {
      id: 3,
      title: "Project Presentation 3",
      description: "Demo video.",
      feedback: [
        { category: "Confidence", comment: "Excellent confidence and strong voice projection." },
        { category: "Content", comment: "Great structure, but ensure smooth transitions between topics." },
        { category: "Delivery", comment: "Try to use more hand gestures for engagement." }
      ]
    }
  ]);

  // Function to handle the click and show feedback
  const handleClick = (feedback) => {
    alert(
      feedback.map((item) => `${item.category}: ${item.comment}`).join("\n")
    );
  };

  return (
    <div className="resource-section">
      <div className="resource-content">
      <h1>Library</h1>
      <p className="subtitle">Here you can find stored videos along with AI feedback.</p>

      <div className="video-container">
        {videos.map((video) => (
          <div key={video.id} className="video-card" onClick={() => handleClick(video.feedback)}>
            <div className="video-card-content">
              <img src="https://via.placeholder.com/150" alt="Video Thumbnail" className="video-thumbnail" />
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <button className="read-more-btn">Read More</button>
            </div>
          </div>
        ))}
      </div></div>
    </div>
  );
};

export default Resource;
