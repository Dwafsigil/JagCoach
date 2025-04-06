import React, { useEffect, useState } from "react";
import "./Library.css";

const Library = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Failed to load videos:", err));
  }, []);

  const handleDelete = async (title) => {
    try {
      await fetch(`http://localhost:5000/delete/${title}`, {
        method: "DELETE",
      });
      setVideos((prev) => prev.filter((v) => v.title !== title));
    } catch (err) {
      console.error("Failed to delete video:", err);
    }
  };

  return (
    <div className="resource-section">
      <div className="library-header">
        <h1>Your Library</h1>
        <p>Here you can find stored videos along with JagCoach feedback.</p>
      </div>

      <div className="card-holder">
        {videos.map((video, index) => (
          <div key={index} className="video-card">
            {/* ❌ Delete button */}
            <button className="delete-btn" onClick={() => handleDelete(video.title)}>
              &times;
            </button>

            <h3>{video.title}</h3>

            {video.video_url ? (
              <video controls>
                <source src={video.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={video.thumbnail_url || "https://via.placeholder.com/300x200"}
                alt="Thumbnail"
                className="video-thumbnail"
              />
            )}

            <div className="feedback-container">
              <strong>AI Feedback:</strong>
              {video.feedback && Array.isArray(video.feedback) ? (
                video.feedback.map((item, idx) => (
                  <div key={idx} className="feedback-box">
                    <strong>{item.category}:</strong> {item.comment}
                  </div>
                ))
              ) : (
                <p>No feedback available.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
