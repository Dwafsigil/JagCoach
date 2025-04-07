import React, { useState, useRef, useEffect } from "react";
import vosk from "vosk-browser"; // Import Vosk library
import "./Dashboard.css";

function Dashboard() {
    const [videoFile, setVideoFile] = useState(null);
    const [transcript, setTranscript] = useState(""); // Real-time transcript
    const [feedback, setFeedback] = useState("AI feedback will appear here...");
    const [isModelLoaded, setIsModelLoaded] = useState(false); // Track if the model is loaded
    const videoRef = useRef(null);
    const voskModelRef = useRef(null); // Ref to store the Vosk model
    let recognition = null;

    // Handle video upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
        }
    };

    // Start speech recognition using Vosk (using Web Audio API)
    const startSpeechRecognition = () => {
        if (!videoRef.current || !isModelLoaded) {
            console.error("Model is not loaded or video reference is invalid.");
            return; // Ensure model is loaded before starting
        }

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const bufferSize = 1024;
        const buffer = new Float32Array(bufferSize);

        // Use the model from the ref
        recognition = new vosk.Recognizer({ model: voskModelRef.current, sampleRate: audioContext.sampleRate });

        const processAudio = () => {
            analyser.getFloatTimeDomainData(buffer);
            recognition.acceptWaveform(buffer);

            const result = recognition.result();
            if (result.text) {
                console.log("Transcript updated:", result.text); // Logging the transcript for debugging
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

    // Load Vosk model asynchronously
    const loadModel = async () => {
        try {
            const voskModel = new vosk.Model("model"); // Ensure this path is correct
            voskModelRef.current = voskModel; // Store the model in the ref
            setIsModelLoaded(true); // Model loaded successfully
            console.log("Vosk model loaded.");
        } catch (error) {
            console.error("Error loading Vosk model", error);
            setFeedback("Error loading speech recognition model.");
        }
    };

    // Send transcript to AI for feedback (Analysis)
    const sendTranscriptForAnalysis = () => {
        // Perform analysis on the transcript
        if (transcript) {
            // Simple analysis for clarity and repetition
            const clarityFeedback = transcript.length > 50 ? "Clear speech" : "Could be more articulate"; // Simple clarity check
            const words = transcript.split(" ");
            const repetitionFeedback = analyzeRepetition(words);
            setFeedback(`Clarity: ${clarityFeedback}, Repetition: ${repetitionFeedback}`);
            console.log("Analysis Feedback:", `Clarity: ${clarityFeedback}, Repetition: ${repetitionFeedback}`);
        } else {
            setFeedback("No transcript available for analysis.");
        }
    };

    // Simple repetition check
    const analyzeRepetition = (words) => {
        const wordCount = {};
        words.forEach(word => {
            word = word.toLowerCase(); // Normalize the word
            wordCount[word] = (wordCount[word] || 0) + 1;
        });

        const repeatedWords = Object.keys(wordCount).filter(word => wordCount[word] > 3); // Words repeated more than 3 times
        if (repeatedWords.length > 0) {
            return `Avoid repetition of words like: ${repeatedWords.join(", ")}`;
        } else {
            return "Good variety in vocabulary.";
        }
    };

    // Handle video playback
    useEffect(() => {
        loadModel(); // Load model when the component mounts
    }, []);

    // Start speech recognition when video starts playing
    const handleVideoPlay = () => {
        startSpeechRecognition(); // Trigger recognition when the video plays
    };

    return (
        <div className="dashboard-container">
            <h1 className="page-title">Video Analysis Dashboard</h1>
            <div className="dashboard-content">
                {/* Left Side: Video Upload */}
                <div className="video-section">
                    {videoFile ? (
                        <div className="video-player">
                            <video
                                ref={videoRef}
                                controls
                                onPlay={handleVideoPlay} // Start recognition when video plays
                            >
                                <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                            </video>
                        </div>
                    ) : (
                        <input className="input" type="file" accept="video/*" onChange={handleFileChange} />
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
