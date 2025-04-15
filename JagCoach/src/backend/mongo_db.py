from pymongo import MongoClient

# Connect to the local MongoDB database and return the "JagCoachSim" DB
def get_db():
    client = MongoClient("mongodb://localhost:27017/")
    return client["JagCoachSim"]

# Save a new video with feedback 
def insert_video_with_feedback(title, video_url, feedback):
    db = get_db()
    collection = db["simulated_feedback"]

    doc = {
        "title": title,              # filename or video title
        "video_url": video_url,      # link to play the video
        "feedback": feedback         # list of feedback comments
    }

    result = collection.insert_one(doc)
    return str(result.inserted_id) 

# Get all videos in the database 
def get_all_videos():
    db = get_db()
    collection = db["simulated_feedback"]
    return list(collection.find({}, {"_id": 0}))  

# Save a new user during registration
def insert_user(name, email, hashed_password):
    db = get_db()
    users_collection = db["users"]

    users_collection.insert_one({
        "name": name,                 # user's name
        "email": email,               # user's email 
        "password": hashed_password   # hashed password 
    })

# Find a user by email 
def find_user_by_email(email):
    db = get_db()
    users_collection = db["users"]
    return users_collection.find_one({"email": email})
