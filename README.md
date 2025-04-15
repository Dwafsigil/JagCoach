#  JagCoach UI - Team 2

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


