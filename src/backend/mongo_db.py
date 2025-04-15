from pymongo import MongoClient

def get_db():
    client = MongoClient("mongodb://localhost:27017/")
    return client["JagCoachSim"]

def insert_video_with_feedback(title, video_url, feedback):
    db = get_db()
    collection = db["simulated_feedback"] 
    doc = {
        "title": title,
        "video_url": video_url,
        "feedback": feedback
    }
    result = collection.insert_one(doc)
    return str(result.inserted_id)

def get_all_videos():
    db = get_db()
    collection = db["simulated_feedback"]
    return list(collection.find({}, {"_id": 0}))

def insert_user(name, email, hashed_password):
    db = get_db()  # ✅ fix here
    users_collection = db["users"]
    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password
    })

def find_user_by_email(email):
    db = get_db() 
    users_collection = db["users"]
    return users_collection.find_one({"email": email})
