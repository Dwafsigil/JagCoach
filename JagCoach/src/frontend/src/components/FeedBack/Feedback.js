import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Feedback.css";

const Feedback = () => {
  const location = useLocation();
  const { transcript, analysis } = location.state || {};
  const [liveFeedback, setLiveFeedback] = useState("");

  useEffect(() => {
    const savedFeedback = localStorage.getItem("liveFeedback");
    if (savedFeedback) {
      setLiveFeedback(savedFeedback);
    }
  }, []);

  const hasAnalysis = analysis && Object.keys(analysis).length > 0;

  return (
    <div className="feedback-page">
      {/* Background hint watermark */}
      <div className="feedback-hint-overlay">
        <h1>JagCoach Feedback</h1>
        <p>Comprehensive evaluation of your presentation:</p>
      </div>

      {(hasAnalysis || transcript) && (
        <div className="feedback-grid">
          {/* Box 1: Video Preview */}
          {analysis?.video_url && (
            <div className="feedback-box video-preview-box">
              <h2>Video Preview</h2>
              <video controls className="feedback-video">
                <source src={analysis.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Box 2: Live Feedback */}
          <div className="feedback-box live-feedback-box">
            <h2>Live Feedback</h2>
            <p>{liveFeedback || "No live feedback captured."}</p>
          </div>

          {/* Box 3: Transcript */}
          {transcript && (
            <div className="feedback-box transcript-box">
              <h2>Transcript</h2>
              <p>{transcript}</p>
            </div>
          )}

          {/* Box 4: Speech Analysis */}
          {analysis && (
            <div className="feedback-box analysis-box">
              <h2>Speech Analysis</h2>
              <p><strong>Speech Rate:</strong> {analysis.speech_rate_wps} words/sec</p>
              <p><strong>Number of Pauses:</strong> {analysis.num_pauses}</p>
              <p><strong>Total Silence:</strong> {analysis.total_silence_sec} seconds</p>
              <p><strong>Average Pitch:</strong> {analysis.average_pitch} Hz</p>
              <p><strong>Eye Contact Ratio:</strong> {analysis.eye_contact_ratio}</p>
              <p><strong>Emotion Summary:</strong> {JSON.stringify(analysis.emotion_summary)}</p>
            </div>
          )}

          {/* Box 5: AI Feedback */}
          {analysis?.ai_feedback && (
            <div className="feedback-box ai-feedback-box">
              <h2>AI Feedback</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: analysis.ai_feedback
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/^- /gm, "<br>• ")
                    .replace(/\n{2,}/g, "<br><br>")
                    .replace(/\n/g, " "),
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feedback;
