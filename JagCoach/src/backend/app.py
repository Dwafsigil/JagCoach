from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import hashlib
import os
from mongo_db import (
    insert_user,
    find_user_by_email,
    insert_video_with_feedback,
    get_all_videos,
    get_db
)

app = Flask(__name__)
CORS(app)  

# ========== User Registration ==========
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # Check if any field is missing
    if not name or not email or not password:
        return jsonify({"status": "fail", "message": "Missing fields"}), 400

    # Don't allow duplicate users
    if find_user_by_email(email):
        return jsonify({"status": "fail", "message": "User already exists"}), 409

    # Hash the password for safety
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    insert_user(name, email, hashed_pw)
    return jsonify({"status": "success", "message": "User registered successfully"}), 201

# ========== User Login ==========
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = find_user_by_email(email)
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()

    # Check if email or password is incorrect
    if not user or user["password"] != hashed_pw:
        return jsonify({"status": "fail", "message": "Incorrect email or password"}), 401

    return jsonify({"status": "success", "message": "Login successful"}), 200

# ========== Upload Route ==========

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Make uploads folder if it doesn't exist

# For serving uploaded files back (if needed)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Upload a video and store feedback
@app.route("/upload", methods=["POST"])
def upload():
    video_file = request.files.get("file")
    if not video_file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save the file locally
    filepath = os.path.join(UPLOAD_FOLDER, video_file.filename)
    video_file.save(filepath)
    video_url = f"http://localhost:5000/{filepath}"

    # Simulated feedback for demo purposes
    feedback = [
        {"category": "Clarity", "comment": "Your speech was clear and well-paced."},
        {"category": "Engagement", "comment": "You maintained good eye contact."},
        {"category": "Confidence", "comment": "You spoke with confidence."}
    ]

    # Save to MongoDB
    insert_video_with_feedback(video_file.filename, video_url, feedback)

    return jsonify({
        "message": "Video uploaded and feedback stored.",
        "video_url": video_url,
        "transcript": "Simulated transcript text."
    })

# ========== Get All Videos ==========
@app.route("/videos", methods=["GET"])
def get_videos():
    return jsonify(get_all_videos())

# ========== Delete a Video by Title ==========
@app.route("/delete/<title>", methods=["DELETE"])
def delete_video(title):
    db = get_db()
    db["simulated_feedback"].delete_one({"title": title})
    return jsonify({"message": f"{title} deleted."})

# ========== Start the Server ==========
if __name__ == "__main__":
    app.run(debug=True)
