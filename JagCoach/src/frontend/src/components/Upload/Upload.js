import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

function Upload() {
  const [videoFile, setVideoFile] = useState(null);
  const [rubricText, setRubricText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [liveFeedback, setLiveFeedback] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
    setLiveFeedback("");
  };

  const handleRubricChange = (event) => {
    setRubricText(event.target.value);
  };

  const handleAnalyze = async () => {
    if (!videoFile) {
      alert("Please upload a video first.");
      return;
    }

    const email = localStorage.getItem("userEmail");
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("rubric", rubricText);
    formData.append("email", email);

    setUploading(true);
    setLiveFeedback("Analyzing... please wait...");

    try {
      const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setLiveFeedback("✅ Analysis Complete!");
        navigate("/feedback", {
          state: {
            transcript: data.transcript,
            analysis: data,
          },
        });
      } else {
        const errMsg = data.error || "Error processing video. Please try again.";
        setLiveFeedback(errMsg);
      }
    } catch (error) {
      console.error("Error analyzing video:", error);
      setLiveFeedback("Error: Network or server issue.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-section">
        <h1>Upload Your Presentation</h1>

        <input type="file" accept="video/*" onChange={handleFileChange} />

        {videoFile && (
          <video controls>
            <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
            Your browser does not support the video tag.
          </video>
        )}

        <textarea
          placeholder="(Optional) Enter your custom rubric here..."
          value={rubricText}
          onChange={handleRubricChange}
        />

        <button onClick={handleAnalyze} disabled={uploading}>
          {uploading ? "Analyzing..." : "Analyze Video"}
        </button>
      </div>

      {liveFeedback && (
        <div className="live-feedback-box">
          <h3>Live Feedback</h3>
          <p>{liveFeedback}</p>
        </div>
      )}
    </div>
  );
}

export default Upload;
