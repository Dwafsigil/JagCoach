import React, { useEffect, useState } from "react";
import "./Library.css";

const Library = () => {
  const [videos, setVideos] = useState([]);
  const [selectedTab, setSelectedTab] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      const userEmail = localStorage.getItem("userEmail"); 
      if (!userEmail) {
        console.error("User not logged in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });

        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          console.error("Failed to fetch videos");
        }
      } catch (err) {
        console.error("Failed to load videos:", err);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (title) => {
    const userEmail = localStorage.getItem("userEmail"); // Get user's email
  
    try {
      const response = await fetch("http://localhost:5000/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title, email: userEmail }),
      });
  
      if (response.ok) {
        setVideos((prev) => prev.filter((v) => v.title !== title));
      } else {
        console.error("Failed to delete video");
      }
    } catch (err) {
      console.error("Failed to delete video:", err);
    }
  };
  

  const handleTabChange = (title, tab) => {
    setSelectedTab((prev) => ({ ...prev, [title]: tab }));
  };

  return (
    <div className="resource-section">
      {/* Background hint */}
      <div className="background-hint">
        <h1>Your Library</h1>
        <p>Here you can find stored videos along with JagCoach feedback.</p>
      </div>

      {/* Video cards */}
      <div className="card-holder">
        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          videos.map((video, index) => (
            <div key={index} className="video-card">

              {/* Delete Button */}
              <button className="delete-btn" onClick={() => handleDelete(video.title)}>
                &times;
              </button>

              {/* Video Title */}
              <h3>{video.title}</h3>

              {/* Video Preview */}
              {video.video_url ? (
                <video controls className="video-preview">
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

              {/* Tabs */}
              <div className="tab-buttons">
                <button
                  className={`tab-btn ${selectedTab[video.title] === "transcript" ? "active" : ""}`}
                  onClick={() => handleTabChange(video.title, "transcript")}
                >
                  Speech Transcript
                </button>

                <button
                  className={`tab-btn ${selectedTab[video.title] === "analysis" ? "active" : ""}`}
                  onClick={() => handleTabChange(video.title, "analysis")}
                >
                  Speech Analysis
                </button>

                <button
                  className={`tab-btn ${selectedTab[video.title] === "feedback" ? "active" : ""}`}
                  onClick={() => handleTabChange(video.title, "feedback")}
                >
                  AI Feedback
                </button>
              </div>

              {/* Tab Content */}
              <div className="feedback-container">
                {selectedTab[video.title] === "transcript" ? (
                  <div className="feedback-box">
                    {video.transcript ? (
                      <p>{video.transcript}</p>
                    ) : (
                      <p>No transcript available.</p>
                    )}
                  </div>
                ) : selectedTab[video.title] === "analysis" ? (
                  <div className="feedback-box">
                    {video.speech_analysis ? (
                      <>
                        <p><strong>Speech Rate:</strong> {video.speech_analysis.speech_rate_wps} words/sec</p>
                        <p><strong>Number of Pauses:</strong> {video.speech_analysis.num_pauses}</p>
                        <p><strong>Total Silence:</strong> {video.speech_analysis.total_silence_sec} seconds</p>
                        <p><strong>Average Pitch:</strong> {video.speech_analysis.average_pitch} Hz</p>
                        <p><strong>Eye Contact Ratio:</strong> {video.speech_analysis.eye_contact_ratio}</p>
                        <p><strong>Emotion Summary:</strong> {video.speech_analysis.emotion_summary}</p>
                      </>
                    ) : (
                      <p>No speech analysis available.</p>
                    )}
                  </div>
                ) : (
                  <>
                    <strong>AI Feedback:</strong>
                    {video.feedback ? (
                      Array.isArray(video.feedback) ? (
                        video.feedback.map((item, idx) => (
                          <div key={idx} className="feedback-box">
                            <strong>{item.category}:</strong> {item.comment}
                          </div>
                        ))
                      ) : (
                        <div className="feedback-box">{video.feedback}</div>
                      )
                    ) : (
                      <p>No AI feedback available.</p>
                    )}
                  </>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Library;
