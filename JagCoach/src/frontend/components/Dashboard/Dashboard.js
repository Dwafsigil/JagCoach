

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import vosk from "vosk-browser"; // Import Vosk library
import "./Dashboard.css";

function Dashboard() {
    const [videoFile, setVideoFile] = useState(null);
    const [transcript, setTranscript] = useState(""); // Real-time transcript hopefully
    const [feedback, setFeedback] = useState("AI feedback will appear here...");
    const videoRef = useRef(null);
    let recognition = null;
 
    const navigate = useNavigate(); // For navigating to another page if needed

    // Handle video upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
        }
    };
    // Start speech recognition using Vosk (using Web Audio API)
    const startSpeechRecognition = () => {
        if (!videoRef.current) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const mediaElementSource = audioContext.createMediaElementSource(videoRef.current);

        mediaElementSource.connect(analyser);
        analyser.connect(audioContext.destination);

        const bufferSize = 1024;
        const buffer = new Float32Array(bufferSize);
        const voskModel = new vosk.Model('model'); // Replace 'model' with the path to your Vosk model

        // Creating a Vosk recognizer
        recognition = new vosk.Recognizer({ model: voskModel, sampleRate: audioContext.sampleRate });

        const processAudio = () => {
            analyser.getFloatTimeDomainData(buffer);
            recognition.acceptWaveform(buffer);

            const result = recognition.result();
            if (result.text) {
                setTranscript(result.text); // Set the real-time transcript
            }

            if (videoRef.current.paused || videoRef.current.ended) {
                recognition.stop();
                sendTranscriptForAnalysis(); // Send transcript for analysis when the video finishes
            } else {
                requestAnimationFrame(processAudio); // Keep processing audio
            }
        };

        requestAnimationFrame(processAudio); // Start the audio processing loop
    };

    // Send transcript to AI for feedback
    const sendTranscriptForAnalysis = async () => {
        if (!transcript) return;

        try {
            const response = await fetch("http://localhost:5000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript }),
            });

            const data = await response.json();
            setFeedback(data.feedback || "No feedback received.");
        } catch (error) {
            console.error("Error analyzing transcript:", error);
            setFeedback("Error processing feedback. Please try again.");
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.onplay = startSpeechRecognition;
        }
    }, [videoFile]);

    return (
        <div className="dashboard-container">
            <h1 className="page-title">Video Analysis Dashboard</h1>
            {/* Video Upload & Transcript Side by Side */}
            <div className="dashboard-content">
                {/* Left Side: Video Upload */}
                <div className="video-section">
                {videoFile ? (
                        <div className="video-player">
                            <video ref={videoRef} controls>
                                <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <div className="input-div">
                            <input className="input" type="file" accept="video/*" onChange={handleFileChange} />
                        </div>
                    )}
                    
                    
                    {/* Right Side: Real-time Transcript */}
                        <div className="transcript-box">
                            <h2>Transcript</h2>
                            
                            <p>{transcript || "Transcript will appear here..."}</p>
                        </div>
                </div>

                
                {/* AI Feedback Box */}
                <div className="feedback-box">
                    <h2>AI Feedback</h2>
                    <p>{feedback}</p>
                </div>
                </div>
        </div>
    );
}

export default Dashboard;