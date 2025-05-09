from pymongo import MongoClient
from app.config import get_settings

settings = get_settings()

MONGODB_URI = settings.MONGODB_URI

client = MongoClient(MONGODB_URI)
db = client["ingredient_db"]

def save_analysis(product_name, result):
    db.analysis.insert_one({
        "name": product_name,
        "result": result
    })
