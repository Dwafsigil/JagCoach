#  JagCoach

## Demo Video:
https://youtu.be/Sfk7p8peNZE

Short walkthrough demonstrating the upload workflow, speech and facial analysis pipeline, and generated presentation feedback.

## Project Overview
JagCoach is a full-stack presentation coaching application that analyzes uploaded presentation videos and generates structured feedback using speech and facial signals. The system extracts speaking metrics such as pace, pauses, silence duration, pitch, and facial expression patterns, then combines them with AI-generated coaching suggestions to help users improve delivery.

## Features
- Upload presentation videos
- Speech transcription using Whisper
- Speaking-rate, pause, silence, and pitch analysis
- Facial expression and eye-contact estimation using DeepFace
- Structured AI-generated presentation feedback
- Optional rubric-based grading
- User authentication and saved session history

## Screenshots
### Home
<img width="550"  alt="image" src="https://github.com/user-attachments/assets/5497c234-d23e-4545-9f71-fbfb50c74ce9" />

### Library
<img width="550"  alt="image" src="https://github.com/user-attachments/assets/067a52f9-a207-48f4-b6a2-cb56392bb8f0" />

### AI Feedback
<img width="550"  alt="image" src="https://github.com/user-attachments/assets/f528a88f-da86-4991-ac1e-19324c4d5a16" />

## Tech Stack
### Frontend:
React

### Backend:
Flask (Python)

### Analysis Pipeline:
Whisper<br>DeepFace<br>Librosa<br>Parselmouth<br>Ffmpeg

### Database:
SQLite (Flask-SQLAlchemy)

### AI Feedback:
OpenAI API

## System Architecture
JagCoach processes uploaded presentation videos by extracting speech and facial delivery signals, then generates structured coaching feedback using an AI model. The system integrates a React frontend with a Flask-based backend that coordinates the analysis pipeline and stores previous feedback sessions for later review.


## Installation Steps

### Clone the repository 

git clone --branch milestone3-branch --single-branch https://github.com/Dwafsigil/JagCoach.git

### Set up Environment and Dependencies

python -m venv venv (Create environment)

(Ensure the environment is always up when running the frontend and backend.)
venv\Scripts\activate (Windows) 
source venv/bin/activate (Mac/Linux)  

pip install -r requirements.txt (Install dependencies)

### Frontend 
1. cd src/frontend
2. npm install
3. npm start

### Backend 
1. cd src/backend
2. Run the backend, "python3 app.py"

### How to Use the Application
1. Create an account
2. Log in to the account
3. Upload a video to be analyzed. Providing a rubric is optional.
4. Click analyze, then view results.

## Deployment Notes
This project is presented as a controlled demo rather than a public deployment because open video uploads introduce moderation, storage, and privacy considerations.

## Contributions
Johnny Tu, Charidi Stevens, David Ludemann, Charisma Ricarte, Bao Nguyen, Jakarria Wilcox
