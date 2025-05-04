import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";

import "./Upload.css";

function Upload() {
  const [videoFile, setVideoFile] = useState(null);
  const [rubricFile, setRubricFile] = useState(null);
  const [rubricFileName, setRubricFileName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState({});
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const rubricInputRef = useRef(null);

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleRubricUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      setRubricFile(file);
      setRubricFileName(file.name);
      console.log("Rubric file uploaded:", file.name);
    } else {
      console.error("Please upload a valid .txt file.");
    }
  };

  const handleAnalyze = async () => {
    console.log("Start analyzing...");

    // Check if user is logged in
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("You must be logged in to upload and analyze videos.");
      navigate("/login");  // Redirect to login page
      return;
    }

    if (!videoFile) {
      alert("Please upload a video before analyzing.");
      return;
    }

    setStatus("processing");

    const formData = new FormData();
    formData.append("video", videoFile);

    if (rubricFile) {
      formData.append("rubric", rubricFile);
    }

    try {
      const response = await fetch("http://34.55.142.231:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error || "Error processing video. Please try again.";
        setTranscript(errMsg);
        return;
      }

      const data = await response.json();
      console.log("Analysis Data:", data);

      const videoFilename = data.video_filename;
      const aiFeedback = data.ai_feedback;

      await fetch("http://34.55.142.231:5000/save-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          video_filename: videoFilename,
          feedback: aiFeedback,
        }),
      });

      console.log("Video and feedback saved successfully!");

      setTranscript(data.transcript);
      setFeedback(data.ai_feedback);
      setAnalysis(data);

      // Success: redirect to Library
      navigate("/library");
    } catch (error) {
      console.error("Error analyzing video:", error);
      setFeedback("Error processing video. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Video Analysis Dashboard</h1>

      {videoFile && status === "processing" ? (
        <div className="dashboard-content">
          <div className="loader-div">
            <MoonLoader size={50} color="#77232C" />
          </div>
        </div>
      ) : (
        <div className="upload-content">
          <div className="upload-div">
            {videoFile ? (
              <video controls>
                <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <input type="file" accept="video/*" onChange={handleFileChange} />
            )}

            <button className="save-button" onClick={handleAnalyze}>
              Analyze Video
            </button>

            <div style={{ marginTop: "10px" }}>
              <input
                ref={rubricInputRef}
                type="file"
                accept=".txt"
                id="rubric-upload"
                onChange={handleRubricUpload}
                style={{ display: "none" }}
              />
              <button
                className="save-button"
                type="button"
                onClick={() => rubricInputRef.current && rubricInputRef.current.click()}
              >
                Upload Rubric
              </button>
            </div>

            {rubricFileName && (
              <p style={{ marginTop: "10px", color: "#77232C", fontWeight: "bold" }}>
                Uploaded Rubric: {rubricFileName}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;

