from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import hashlib
import os
import subprocess
import whisper
import librosa
import numpy as np
import parselmouth
import openai
import cv2
from collections import Counter
from pymongo import MongoClient
from deepface import DeepFace

# ====== MongoDB Functions ======
def get_db():
    client = MongoClient("mongodb://<YOUR_URL_HERE>")
    return client["JagCoachSim"]

def insert_video_with_feedback(title, video_url, feedback, email):
    db = get_db()
    collection = db["simulated_feedback"]
    doc = {
        "title": title,
        "video_url": video_url,
        "feedback": feedback,
        "email": email
    }
    result = collection.insert_one(doc)
    return str(result.inserted_id)

def get_all_videos(email):
    db = get_db()
    collection = db["simulated_feedback"]
    return list(collection.find({"email": email}, {"_id": 0}))

def insert_user(name, email, hashed_password):
    db = get_db()
    users_collection = db["users"]
    users_collection.insert_one({"name": name, "email": email, "password": hashed_password})

def find_user_by_email(email):
    db = get_db()
    users_collection = db["users"]
    return users_collection.find_one({"email": email})

# ====== App Initialization ======
app = Flask(__name__)
CORS(app)

# Load API Key
openai.api_key = "Insert OpenAI Key"
if not openai.api_key:
    raise ValueError("OpenAI API key is missing. Ensure it is set in the environment.")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ====== User Registration ======
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"status": "fail", "message": "Missing fields"}), 400

    if find_user_by_email(email):
        return jsonify({"status": "fail", "message": "User already exists"}), 409

    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    insert_user(name, email, hashed_pw)
    return jsonify({"status": "success", "message": "User registered successfully"}), 201

# ====== Delete ======
@app.route("/delete", methods=["POST", "OPTIONS"])
def delete_video():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

    data = request.get_json()
    title = data.get("title")
    email = data.get("email")

    if not title or not email:
        return jsonify({"error": "Missing title or email"}), 400

    db = get_db()
    result = db["simulated_feedback"].delete_one({
        "title": title,
        "email": email
    })

    if result.deleted_count == 1:
        return jsonify({"message": f"{title} deleted."}), 200
    else:
        return jsonify({"error": "Video not found or not authorized"}), 404

# ====== User Login ======
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = find_user_by_email(email)
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()

    if not user or user["password"] != hashed_pw:
        return jsonify({"status": "fail", "message": "Incorrect email or password"}), 401

    return jsonify({"status": "success", "message": "Login successful"}), 200

# ====== Upload (basic, not used now) ======
@app.route("/upload", methods=["POST"])
def upload():
    video_file = request.files.get("file")
    if not video_file:
        return jsonify({"error": "No file uploaded"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, video_file.filename)
    video_file.save(filepath)
    video_url = f"http://localhost:5000/{filepath}"

    # Dummy feedback
    feedback = [
        {"category": "Clarity", "comment": "Your speech was clear and well-paced."},
        {"category": "Engagement", "comment": "You maintained good eye contact."},
        {"category": "Confidence", "comment": "You spoke with confidence."}
    ]

    # Hardcoded "test@example.com" because upload() isn't used anymore
    insert_video_with_feedback(video_file.filename, video_url, feedback, "test@example.com")

    return jsonify({
        "message": "Video uploaded and feedback stored.",
        "video_url": video_url,
        "transcript": "Simulated transcript text."
    })

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ====== New Get Videos for Specific User ======
@app.route("/videos", methods=["POST"])
def videos_by_user():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Missing email"}), 400

    videos = get_all_videos(email)
    return jsonify(videos)

# ====== Transcribe and Analyze Video ======
@app.route("/transcribe", methods=["POST"])
def transcribe_video():
    if "video" not in request.files or "email" not in request.form:
        return jsonify({"error": "Missing video or email"}), 400

    email = request.form["email"]
    video_file = request.files["video"]
    video_path = os.path.join("uploads", video_file.filename)
    os.makedirs("uploads", exist_ok=True)
    video_file.save(video_path)

    video_url = f"http://localhost:5000/uploads/{video_file.filename}"

    emotion_summary, eye_contact_ratio = analyze_faces(video_path)

    audio_path = "temp_audio.wav"
    ffmpeg_cmd = ["ffmpeg", "-y", "-i", video_path, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", audio_path]
    subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    model = whisper.load_model("small")
    result = model.transcribe(audio_path, fp16=False)
    transcript = result.get("text", "")

    y, sr = librosa.load(audio_path, sr=16000)
    duration = librosa.get_duration(y=y, sr=sr)
    num_words = len(transcript.split())
    speech_rate = num_words / duration if duration > 0 else 0
    intervals = librosa.effects.split(y, top_db=30)
    total_silence = sum((intervals[i][0] - intervals[i-1][1]) / sr for i in range(1, len(intervals)))
    num_pauses = sum(1 for gap in np.diff([i[0] for i in intervals]) if gap / sr > 0.3)
    sound = parselmouth.Sound(audio_path)
    pitch = sound.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    avg_pitch = np.mean(pitch_values[pitch_values > 0]) if len(pitch_values[pitch_values > 0]) > 0 else 0

    feedback_text = get_chatgpt_feedback(transcript, speech_rate, num_pauses, total_silence, avg_pitch, emotion_summary, eye_contact_ratio)

    db = get_db()
    collection = db["simulated_feedback"]

    collection.insert_one({
        "title": video_file.filename,
        "video_url": video_url,
        "transcript": transcript,
        "speech_analysis": {
            "speech_rate_wps": round(speech_rate, 2),
            "num_pauses": num_pauses,
            "total_silence_sec": round(total_silence, 2),
            "average_pitch": round(avg_pitch, 2),
            "eye_contact_ratio": eye_contact_ratio,
            "emotion_summary": emotion_summary
        },
        "feedback": [
            {"category": "Overall Feedback", "comment": feedback_text}
        ],
        "email": email
    })

    os.remove(audio_path)

    return jsonify({
        "transcript": transcript,
        "speech_rate_wps": round(speech_rate, 2),
        "num_pauses": num_pauses,
        "total_silence_sec": round(total_silence, 2),
        "average_pitch": round(avg_pitch, 2),
        "emotion_summary": emotion_summary,
        "eye_contact_ratio": eye_contact_ratio,
        "ai_feedback": feedback_text,
        "video_url": video_url
    })

# ====== Helper Functions ======
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
- Eye Contact Ratio: {eye_contact_ratio}

Provide feedback in the following format:
- **Tone Variation**
- **Speech Rate**
- **Pauses and Filler Words**
- **Facial Expression/Eye Contact**
- **Overall Feedback**
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

# ====== Run Server ======
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
