from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
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
import time

# Configuration Stuff
openai.api_key =  #OpenAI API Key
if not openai.api_key:
    raise ValueError("OpenAI API key is missing.")

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    videos = db.relationship('Video', backref='user', lazy=True)

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    video_filename = db.Column(db.String(200), nullable=False)
    feedback = db.Column(db.Text, nullable=True)

# Helper Functions
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

'''
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
 **Tone Variation**
 **Speech Rate**
 **Pauses and Filler Words**
 **Facial Expression/Eye Contact**
 **Overall Feedback**
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
'''

def get_chatgpt_feedback(transcript, speech_rate, num_pauses, total_silence, avg_pitch, emotion_summary, eye_contact_ratio, rubric_text=None):
    emotion_text = ', '.join([f"{e[0]}: {e[1]}" for e in emotion_summary]) if emotion_summary else "No faces detected"

    base_prompt = f"""
You are an expert in public speaking and communication analysis. Analyze the speaker's performance based on the following data:

- Transcript of Speech: {transcript}
- Speech Rate: {speech_rate:.2f} words per second
- Number of Pauses: {num_pauses}
- Total Silence Duration: {total_silence:.2f} seconds
- Average Pitch: {avg_pitch:.2f} Hz
- Facial Emotion Summary: {emotion_text}
- Eye Contact Ratio: {eye_contact_ratio:.2f} (fraction of frames with eye contact)

"""

    if rubric_text:
        # Few-shot style guidance
        base_prompt += f"""
Use this grading rubric to assess and score the speaker:

{rubric_text}

Provide feedback structured by the rubric's criteria. Be specific and actionable in your advice.
"""
    else:
        # Default fallback instructions
        base_prompt += """
Provide feedback in the following format:
 **Tone Variation**
 **Speech Rate**
 **Pauses and Filler Words**
 **Facial Expression/Eye Contact**
 **Overall Feedback**
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert public speaking and communication coach."},
                {"role": "user", "content": base_prompt}
            ]
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error generating feedback: {str(e)}"



# API Routes
'''@app.route("/transcribe", methods=["POST"])
def transcribe_video():
    try:
        if "video" not in request.files:
            return jsonify({"error": "No video file uploaded"}), 400

        video_file = request.files["video"]

        timestamp = int(time.time())
        video_filename = f"video_{timestamp}.mp4"
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_filename)
        video_file.save(video_path)

        emotion_summary, eye_contact_ratio = analyze_faces(video_path)

        audio_path = os.path.join(app.config['UPLOAD_FOLDER'], f"audio_{timestamp}.wav")
        subprocess.run([
            "ffmpeg", "-y", "-i", video_path, "-vn",
            "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", audio_path
        ], check=True)

        model = whisper.load_model("small")
        result = model.transcribe(audio_path, fp16=False)
        transcript = result.get("text", "")

        y, sr = librosa.load(audio_path, sr=16000)
        duration = librosa.get_duration(y=y, sr=sr)
        num_words = len(transcript.split())
        speech_rate = num_words / duration if duration > 0 else 0

        intervals = librosa.effects.split(y, top_db=30)
        total_silence = sum((intervals[i][0] - intervals[i - 1][1]) / sr for i in range(1, len(intervals)))
        num_pauses = sum(1 for gap in np.diff([i[0] for i in intervals]) if gap / sr > 0.3)

        sound = parselmouth.Sound(audio_path)
        pitch = sound.to_pitch()
        pitch_values = pitch.selected_array['frequency']
        avg_pitch = np.mean(pitch_values[pitch_values > 0]) if len(pitch_values[pitch_values > 0]) > 0 else 0

        feedback = get_chatgpt_feedback(transcript, speech_rate, num_pauses, total_silence, avg_pitch, emotion_summary, eye_contact_ratio)

        os.remove(audio_path)

        return jsonify({
            "transcript": transcript,
            "speech_rate_wps": round(speech_rate, 2),
            "num_pauses": num_pauses,
            "total_silence_sec": round(total_silence, 2),
            "average_pitch": round(avg_pitch, 2),
            "emotion_summary": emotion_summary,
            "eye_contact_ratio": eye_contact_ratio,
            "ai_feedback": feedback,
            "video_filename": video_filename
        })

    except Exception as e:
        print(f"Error in /transcribe route: {str(e)}")
        return jsonify({"error": f"Backend error: {str(e)}"}), 500
'''
@app.route("/transcribe", methods=["POST"])
def transcribe_video():
    try:
       
        if "video" not in request.files:
            return jsonify({"error": "No video file uploaded"}), 400

        video_file = request.files["video"]
        rubric_file = request.files.get("rubric") 

        rubric_text = None
        if rubric_file:
            rubric_text = rubric_file.read().decode('utf-8')  
            print("Rubric received:", rubric_text[:100])  

        
        timestamp = int(time.time())
        video_filename = f"video_{timestamp}.mp4"
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_filename)
        video_file.save(video_path)

        emotion_summary, eye_contact_ratio = analyze_faces(video_path)

        audio_path = os.path.join(app.config['UPLOAD_FOLDER'], f"audio_{timestamp}.wav")
        subprocess.run([
            "ffmpeg", "-y", "-i", video_path, "-vn",
            "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", audio_path
        ], check=True)

        model = whisper.load_model("small")
        result = model.transcribe(audio_path, fp16=False)
        transcript = result.get("text", "")

        y, sr = librosa.load(audio_path, sr=16000)
        duration = librosa.get_duration(y=y, sr=sr)
        num_words = len(transcript.split())
        speech_rate = num_words / duration if duration > 0 else 0

        intervals = librosa.effects.split(y, top_db=30)
        total_silence = sum((intervals[i][0] - intervals[i - 1][1]) / sr for i in range(1, len(intervals)))
        num_pauses = sum(1 for gap in np.diff([i[0] for i in intervals]) if gap / sr > 0.3)

        sound = parselmouth.Sound(audio_path)
        pitch = sound.to_pitch()
        pitch_values = pitch.selected_array['frequency']
        avg_pitch = np.mean(pitch_values[pitch_values > 0]) if len(pitch_values[pitch_values > 0]) > 0 else 0

        # Modified to pass rubric
        feedback = get_chatgpt_feedback(
            transcript, speech_rate, num_pauses, total_silence, avg_pitch,
            emotion_summary, eye_contact_ratio, rubric_text
        )

        os.remove(audio_path)

        return jsonify({
            "transcript": transcript,
            "speech_rate_wps": round(speech_rate, 2),
            "num_pauses": num_pauses,
            "total_silence_sec": round(total_silence, 2),
            "average_pitch": round(avg_pitch, 2),
            "emotion_summary": emotion_summary,
            "eye_contact_ratio": eye_contact_ratio,
            "ai_feedback": feedback,
            "video_filename": video_filename
        })

    except Exception as e:
        print(f"Error in /transcribe route: {str(e)}")
        return jsonify({"error": f"Backend error: {str(e)}"}), 500



@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data.get('fullName')
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({"message": "Login successful", "user_id": user.id, "fullName": user.name}), 200

@app.route("/save-video", methods=["POST"])
def save_video():
    data = request.get_json()
    user_id = data.get("user_id")
    video_filename = data.get("video_filename")
    feedback = data.get("feedback")

    if not user_id or not video_filename:
        return jsonify({"error": "Missing user_id or video_filename"}), 400

    new_video = Video(user_id=user_id, video_filename=video_filename, feedback=feedback)
    db.session.add(new_video)
    db.session.commit()

    return jsonify({"message": "Video saved successfully!"}), 201

@app.route("/videos/<int:user_id>", methods=["GET"])
def get_user_videos(user_id):
    videos = Video.query.filter_by(user_id=user_id).all()
    video_list = [
        {"video_id": video.id, "video_filename": video.video_filename, "feedback": video.feedback}
        for video in videos
    ]
    return jsonify(video_list), 200

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# Entry Point
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)



