from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from flask import send_from_directory
from mongo_db import insert_video_with_feedback, get_all_videos, get_db

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/upload", methods=["POST"])
def upload():
    video_file = request.files.get("file")
    if not video_file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save video locally
    filepath = os.path.join(UPLOAD_FOLDER, video_file.filename)
    video_file.save(filepath)
    video_url = f"http://localhost:5000/{filepath}"  # For playback

    # Simulate feedback
    feedback = [
        {"category": "Clarity", "comment": "Your speech was clear and well-paced."},
        {"category": "Engagement", "comment": "You maintained good eye contact."},
        {"category": "Confidence", "comment": "You spoke with confidence."}
    ]

    # Store in MongoDB
    insert_video_with_feedback(video_file.filename, video_url, feedback)

    return jsonify({
        "message": "Video uploaded and feedback stored.",
        "video_url": video_url,
        "transcript": "Simulated transcript text."  # For Feedback page
    })

@app.route("/videos", methods=["GET"])
def get_videos():
    return jsonify(get_all_videos())

@app.route("/delete/<title>", methods=["DELETE"])
def delete_video(title):
    db = get_db()
    db["simulated_feedback"].delete_one({"title": title})
    return jsonify({"message": f"{title} deleted."})


if __name__ == "__main__":
    app.run(debug=True)
