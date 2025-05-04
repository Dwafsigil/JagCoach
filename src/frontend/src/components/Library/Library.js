import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./Library.css";

const Resource = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      try {
        const response = await fetch(`http://34.55.142.231:5000/videos/${userId}`);
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleOpenModal = (video) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
    setModalOpen(false);
  };

  const formatFeedback = (feedback) => {
    if (!feedback) return "No feedback available.";

    const sections = feedback.split("**").filter(Boolean);
    return sections.map((section, index) => {
      const [title, ...contentParts] = section.split("\n");
      const content = contentParts.join("\n").trim();

      return (
        <div key={index} className="feedback-section">
          <h3>{title.trim()}</h3>
          <p>{content}</p>
        </div>
      );
    });
  };

  return (
    <div className="resource-section">
      <h1>Library</h1>
      <div className="resource-content">
        <div className="video-container">
          {videos
            .filter(video => video.video_filename) // Prevent broken video URLs
            .map((video) => (
              <div
                key={video.video_id}
                className="video-card"
                onClick={() => handleOpenModal(video)}
                onMouseEnter={() => setHoveredVideo(video.video_id)}
                onMouseLeave={() => setHoveredVideo(null)}
              >
                <video
                  className="video-thumbnail"
                  src={`http://34.55.142.231:5000/uploads/${video.video_filename}`}
                  type="video/mp4"
                  muted
                  playsInline
                  controls={hoveredVideo === video.video_id}
                >
                  Your browser does not support the video tag.
                </video>

                <h3>{video.video_filename}</h3>
                <p>Click Read More to view AI Feedback</p>
                <button className="read-more-btn">Read More</button>
              </div>
            ))}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={handleCloseModal}
        className="modal-content"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        <button onClick={handleCloseModal} className="close-button">×</button>

        {selectedVideo && (
          <>
            <video controls className="modal-video">
              <source
                src={`http://34.55.142.231:5000/uploads/${selectedVideo.video_filename}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            <div className="modal-feedback">
              <h2>AI Feedback</h2>
              {formatFeedback(selectedVideo.feedback)}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Resource;




