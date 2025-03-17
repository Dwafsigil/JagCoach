#  JagCoach UI - Team 2

The current code can output transcripts, audio analyses, and AI feedback. However, the frontend and backend must be manually run separately in two different terminals.

Also, to run the code, you will need an API Key for OpenAI Chatgpt. You will also need to replace the line in app.py asking for an API Key with your own key.

## Installation Steps

Clone the repository 

git clone --branch milestone1-branch --single-branch https://github.com/Dwafsigil/JagCoach.git

cd JagCoach


### Frontend 

1. cd src/frontend
2. npm install
3. npm start

### Backend 

1. cd src/backend
2. Make sure python3 is installed 
3. Set up the environment and dependencies. (To set up the environment, run "py -3.11 -m venv venv". To activate the environment, run ".\venv\Scripts\Activate". Then install all dependencies, "pip install -r requirements.txt".)
4. Run the backend, "python app.py"
