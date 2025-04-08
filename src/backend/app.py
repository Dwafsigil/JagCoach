from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import whisper
import librosa
import numpy as np
import parselmouth
import openai
from deepface import DeepFace
import cv2
from collections import Counter

# Load API Key
openai.api_key = "Insert OpenAI Key"
if not openai.api_key:
    raise ValueError("OpenAI API key is missing. Ensure it is set in the environment.")

app = Flask(__name__)
CORS(app)

# Facial Recognition
def estimate_eye_contact(analysis):
    head_pose = analysis.get("head_pose", {})
    yaw = head_pose.get("yaw", 0)
    pitch = head_pose.get("pitch", 0)
    roll = head_pose.get("roll", 0)
    return abs(yaw) < 10 and abs(pitch) < 10 and abs(roll) < 10

def analyze_faces(video_path):
    cap = cv2.VideoCapture(video_path)
    frame_rate = cap.get(cv2.CAP_PROP_FPS)
    emotions = []
    eye_contact_count = 0
    total_analyzed = 0
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % int(frame_rate) == 0:
            try:
                analysis = DeepFace.analyze(frame, actions=["emotion"], enforce_detection=False)[0]
                emotions.append(analysis['dominant_emotion'])
                if estimate_eye_contact(analysis):
                    eye_contact_count += 1
                total_analyzed += 1
            except Exception as e:
                print(f"DeepFace error on frame {frame_count}: {str(e)}")

        frame_count += 1

    cap.release()
    emotion_summary = Counter(emotions).most_common()
    eye_contact_ratio = round(eye_contact_count / total_analyzed, 2) if total_analyzed > 0 else 0.0
    return emotion_summary, eye_contact_ratio

@app.route("/transcribe", methods=["POST"])
def transcribe_video():
    if "video" not in request.files:
        return jsonify({"error": "No video file uploaded"}), 400

    video_file = request.files["video"]
    video_path = "temp_video.mp4"
    video_file.save(video_path)

    # DeepFace
    emotion_summary, eye_contact_ratio = analyze_faces(video_path)

    # Extract audio
    audio_path = "temp_audio.wav"
    ffmpeg_cmd = ["ffmpeg", "-y", "-i", video_path, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", audio_path]
    subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Whisper transcription
    model = whisper.load_model("small")
    result = model.transcribe(audio_path, fp16=False)
    transcript = result.get("text", "")

    # Load audio
    y, sr = librosa.load(audio_path, sr=16000)

    # Speech Rate
    duration = librosa.get_duration(y=y, sr=sr)
    num_words = len(transcript.split())
    speech_rate = num_words / duration if duration > 0 else 0

    # Pause Detection
    intervals = librosa.effects.split(y, top_db=30)
    total_silence = sum((intervals[i][0] - intervals[i-1][1]) / sr for i in range(1, len(intervals)))
    num_pauses = sum(1 for gap in np.diff([i[0] for i in intervals]) if gap / sr > 0.3)

    # Tone Variatio
    sound = parselmouth.Sound(audio_path)
    pitch = sound.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    avg_pitch = np.mean(pitch_values[pitch_values > 0]) if len(pitch_values[pitch_values > 0]) > 0 else 0


    # AI Feedback
    feedback = get_chatgpt_feedback(transcript, speech_rate, num_pauses, total_silence, avg_pitch, emotion_summary, eye_contact_ratio)

 # Cleanup
    os.remove(video_path)
    os.remove(audio_path)

    return jsonify({
        "transcript": transcript,
        "speech_rate_wps": round(speech_rate, 2),
        "num_pauses": num_pauses,
        "total_silence_sec": round(total_silence, 2),
        "average_pitch": round(avg_pitch, 2),
        "emotion_summary": emotion_summary,
        "eye_contact_ratio": eye_contact_ratio,
        "ai_feedback": feedback
    })


# Feedback

def get_chatgpt_feedback(transcript, speech_rate, num_pauses, total_silence, avg_pitch, emotion_summary, eye_contact_ratio):
    emotion_text = ', '.join([f"{e[0]}: {e[1]}" for e in emotion_summary]) if emotion_summary else "No faces detected"

    prompt = f"""
You are an expert in public speaking and non-verbal communication. Analyze the following data and provide detailed, constructive feedback.

- Transcript of Speech: {transcript}
- Speech Rate: {speech_rate} words per second
- Number of Pauses: {num_pauses}
- Total Silence Duration: {total_silence} seconds
- Average Pitch: {avg_pitch} Hz
- Facial Emotion Summary: {emotion_text}
- Eye Contact Ratio: {eye_contact_ratio} (percentage of frames where speaker appears to be looking at the audience)

Provide feedback in the following format:
- **Tone Variation**
- **Speech Rate**
- **Pauses and Filler Words**
- **Facial Expression/Eye Contact** (Did the speaker maintain eye contact effectively? Were their expressions and emotions aligned with the topic of their presentation?)
- **Overall Feedback**
(DO NOT ADD ANYTHING ELSE EXCEPT FOR THE FORMAT, however still be as detailed as possible.)
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert public speaking and body language coach."},
                {"role": "user", "content": prompt}
            ]
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error generating feedback: {str(e)}"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
