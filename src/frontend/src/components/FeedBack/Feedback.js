import React from "react";
import { useLocation } from "react-router-dom";
import "./Feedback.css";

const Feedback = () => {
    const location = useLocation();
    const { transcript, analysis } = location.state || {};

    return (
        <div className="feedback-container">
            <h1 className="feedback-title">JagCoach Feedback</h1>
            <p className="feedback-subtitle">Here is an analysis of your oral presentation:</p>

            {/* Speech Transcript Box */}
            {transcript && (
                <div className="feedback-box">
                    <h2>Speech Transcript</h2>
                    <p className="transcript-text">{transcript}</p>
                </div>
            )}

            {/* Speech Analysis Box */}
            {analysis && (
                <div className="feedback-box">
                    <h2>Speech Analysis</h2>
                    <p><strong>Speech Rate:</strong> {analysis.speech_rate_wps} words/sec</p>
                    <p><strong>Number of Pauses:</strong> {analysis.num_pauses}</p>
                    <p><strong>Total Silence:</strong> {analysis.total_silence_sec} sec</p>
                    <p><strong>Average Pitch:</strong> {analysis.average_pitch} Hz</p>
                </div>
            )}

            {/* AI Feedback Box */}
            {analysis?.ai_feedback && (
                <div className="feedback-box ai-feedback">
                    <h2>AI Feedback</h2>
                    <div 
                        className="ai-feedback-text"
                        dangerouslySetInnerHTML={{ 
                            __html: analysis.ai_feedback
                                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")  
                                .replace(/(?:\r\n|\r|\n)/g, "<br><br>")           
                                .replace(/- /g, "<br>• ")                          
                        }} 
                    />
                </div>
            )}
        </div>
    );
};

export default Feedback;
