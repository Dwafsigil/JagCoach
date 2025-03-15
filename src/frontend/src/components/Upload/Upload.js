import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

function Upload() {
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();

  // Update the file state when the user selects a file
  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  // This works when the user clicks "Analyze File"
  const handleAnalyze = async () => {
    if (!videoFile) {
      alert("Please upload a video first.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile); 
    try {
      const response = await fetch("http://34.55.142.231:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Handles error reponse from the backend
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error || "Error processing video. Please try again.";
        navigate("/feedback", { state: { transcript: errMsg } });
        return;
      }

      // Show what the backend returns
      const data = await response.json();
      console.log("Analysis Data:", data);  

      // Moves the user to the feedback page
      navigate("/feedback", { state: { 
          transcript: data.transcript,
          analysis: data // This shows the feedback data such as the speech rate, ai review, etc.
      }});
    } catch (error) {
      console.error("Error analyzing video:", error);
      navigate("/feedback", {
        state: { transcript: "Error processing video. Please try again." },
      });
    }
  };

  return (
    <div className="container">
      <div className="upload-content">
        <div className="video-section">
          <h1>Upload your video</h1>
          <input type="file" accept="video/*" onChange={handleFileChange} />
          {videoFile && (
            <video controls>
              <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
              Your browser does not support the video tag.
            </video>
          )}
          <button onClick={handleAnalyze}>Analyze Video</button>
        </div>
      </div>
    </div>
  );
}

export default Upload;
