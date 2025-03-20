from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import whisper
import librosa
import numpy as np
import parselmouth
import openai 

# Load API Key
openai.api_key = "ChatGPT AI Key"

if not openai.api_key:
    raise ValueError("OpenAI API key is missing. Ensure it is set in the environment.")


app = Flask(__name__)
CORS(app)  # Allow requests from different ports

@app.route("/transcribe", methods=["POST"])
def transcribe_video():
    if "video" not in request.files:
        return jsonify({"error": "No video file uploaded"}), 400

    video_file = request.files["video"]
    video_path = "temp_video.mp4"
    video_file.save(video_path)

    # Extract audio
    audio_path = "temp_audio.wav"
    ffmpeg_cmd = ["ffmpeg", "-y", "-i", video_path, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", audio_path]
    subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Transcribe using Whisper Small
    model = whisper.load_model("small")
    result = model.transcribe(audio_path, fp16=False)
    transcript = result.get("text", "")

    # Load audio for analysis
    y, sr = librosa.load(audio_path, sr=16000)

    # Speech Rate
    duration = librosa.get_duration(y=y, sr=sr)
    num_words = len(transcript.split())
    speech_rate = num_words / duration if duration > 0 else 0

    # Pause Detection
    intervals = librosa.effects.split(y, top_db=30)
    total_silence = sum((intervals[i][0] - intervals[i-1][1]) / sr for i in range(1, len(intervals)))
    num_pauses = sum(1 for gap in np.diff([i[0] for i in intervals]) if gap / sr > 0.3)

    # Tone Variation
    sound = parselmouth.Sound(audio_path)
    pitch = sound.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    avg_pitch = np.mean(pitch_values[pitch_values > 0]) if len(pitch_values[pitch_values > 0]) > 0 else 0

    # Cleanup, remove the audio and video files
    os.remove(video_path)
    os.remove(audio_path)

    # Send data to ChatGPT for feedback
    feedback = get_chatgpt_feedback(transcript, speech_rate, num_pauses, total_silence, avg_pitch)

    # Return results
    return jsonify({
        "transcript": transcript,
        "speech_rate_wps": round(speech_rate, 2),
        "num_pauses": num_pauses,
        "total_silence_sec": round(total_silence, 2),
        "average_pitch": round(avg_pitch, 2),
        "ai_feedback": feedback
    })

def get_chatgpt_feedback(transcript, speech_rate, num_pauses, total_silence, avg_pitch):
    """Send the speech analysis data to ChatGPT and return AI-generated feedback."""
    prompt = f"""
    You are an expert in public speaking and speech analysis. Analyze the following speech data and provide constructive feedback on the presenter's performance.

    - **Transcript of Speech:** {transcript}
    - **Speech Rate:** {speech_rate} words per second
    - **Number of Pauses:** {num_pauses}
    - **Total Silence Duration:** {total_silence} seconds
    - **Average Pitch:** {avg_pitch} Hz

    Provide feedback in the following format, make sure to be as detailed as possible:
    - **Tone Variation** (Does the speaker sound too monotone or is it engaging for the listeners?)
    - **Speech Rate** (Is the speaker speaking too fast, too slow, or is the pace decent?)
    - **Pauses and Filler Words** (Do the pauses feel natural? Are there too many pauses that it's awkward? Do the speaker use too much filler words?)
    - **Overall Feedback** (What are their strengths and areas of improvement?)
    """

    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert public speaking coach."},
                {"role": "user", "content": prompt}

            ]
        )

        return response["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error generating feedback: {str(e)}"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)