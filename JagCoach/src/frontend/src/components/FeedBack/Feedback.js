import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [feedbacks] = useState([
    { id: 1, category: "Clarity", comment: "Your speech was clear and well-paced." },
    { id: 2, category: "Engagement", comment: "Good eye contact and enthusiasm in your tone." },
    { id: 3, category: "Content", comment: "Your points were well-structured and easy to follow." },
    { id: 4, category: "Pronunciation", comment: "Some words were mispronounced; try slowing down slightly." },
    { id: 5, category: "Confidence", comment: "You appeared confident, but avoid too many filler words." },
    { id: 6, category: "Pacing", comment: "The pacing was good, but some parts felt rushed." },
  ]);

  return (
    <div className="analysis-container">
      <h1>JagCoach Feedback</h1>
      <p>Here is an analysis of your oral presentation:</p>
      <div className="analysis-list">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="analysis-item">
            <strong>{feedback.category}:</strong> {feedback.comment}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
