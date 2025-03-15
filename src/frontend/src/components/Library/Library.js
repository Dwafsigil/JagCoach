import React, { useState } from "react";
import "./Library.css";

const Resource = () => {
  // Simulated uploaded videos with multiple AI feedback categories
  const [videos] = useState([
    { 
      id: 1, 
      title: "Project Presentation", 
      feedback: [
        { category: "Clarity", comment: "Your speech was clear and well-paced." },
        { category: "Engagement", comment: "Good eye contact and enthusiasm in your tone." },
        { category: "Confidence", comment: "You appeared confident, but avoid too many filler words." }
      ]
    },
    { 
      id: 2, 
      title: "Project Presentation 2", 
      feedback: [
        { category: "Clarity", comment: "Try to enunciate words more clearly." },
        { category: "Pacing", comment: "Slow down slightly for better comprehension." },
        { category: "Pronunciation", comment: "Some words were mispronounced; try slowing down." }
      ]
    },
    { 
      id: 3, 
      title: "Project Presentation 3", 
      feedback: [
        { category: "Confidence", comment: "Excellent confidence and strong voice projection." },
        { category: "Content", comment: "Great structure, but ensure smooth transitions between topics." },
        { category: "Delivery", comment: "Try to use more hand gestures for engagement." }
      ]
    }
  ]);

  return (
    <div className="resource-section">
      <h1>Library</h1>
      <p>Here you can find stored videos along with AI feedback.</p>

      <div className="video-container">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <h3>{video.title}</h3>

            <video controls>
               <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="feedback-container">
              {video.feedback.map((item, index) => (
                <div key={index} className="feedback-box">
                  <strong>{item.category}:</strong> {item.comment}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resource;
