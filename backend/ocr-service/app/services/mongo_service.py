from pymongo import MongoClient
from app.config import get_settings

settings = get_settings()

MONGODB_URI = settings.MONGODB_URI

client = MongoClient(MONGODB_URI)
db = client["nutrition_db"]

def save_product(product_name, result):
    db.product.insert_one({
        "name": product_name,
        "result": result
    })
