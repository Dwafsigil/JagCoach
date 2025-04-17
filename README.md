#  JagCoach UI - Team 2


##  Using the Application

1. Open the app in your browser: [http://localhost:3000](http://localhost:3000)
2. Create a new account by entering your **name**, **email**, and **password**.
3. Log in using your registered **email** and **password**.
4. Navigate to the **Upload** page and submit a presentation video file.
5. The system will automatically store the video and generate **simulated AI feedback**.
6. Go to the **Library** page to view a list of uploaded videos and see feedback.
7. You can also **delete videos** from the Library.
8. Visit the **Feedback** page to review a **simulated transcript** of your presentation.

> ⚠️ Note: This branch focuses on implementing the frontend and database connection only.  
> The Library page currently displays all uploaded videos, and AI feedback is simulated.  
> User-specific video filtering will be implemented soon.

##  Installation Steps

### FrontEnd (React):
###  Navigate to the frontend folder:
```sh
cd JagCoach
cd src/frontend
```

###  Install dependencies:
```sh
npm install
```

### Start the development server:
```sh
npm start
```
> The frontend will run at: `http://localhost:3000`

---
## Backend Setup (Flask + MongoDB)

### Backend:
- Python 3.8+
- pip
- MongoDB (via MongoDB compass)
- Mongo URL
  
###  Navigate to the backend folder:
```bash
cd JagCoach
cd src/backend
```

### Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

###  Install Python dependencies:
```bash
pip install flask flask-cors pymongo
```

###  Start MongoDB (if not running):

**If using Homebrew on macOS:**
```bash
brew services start mongodb-community
```

**Or run it manually:**
```bash
mongod
```

### Run the Flask backend:
```bash
python app.py
```

> The backend will run at: `http://localhost:5000`

---


