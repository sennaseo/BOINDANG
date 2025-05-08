from pymongo import MongoClient
from app.config import get_settings

settings = get_settings()
MONGODB_URI = settings.MONGODB_URI

client = MongoClient(MONGODB_URI)
db = client["ingredient_db"]

def save_analysis(product_name, result):
    print(f"📝 MongoDB 저장 시도 - 제품명: {product_name}")

    existing = db.analysis.find_one({"name": product_name})
    if existing:
        print(f"⚠️ 이미 존재하는 제품명: {product_name}")
        return  # 또는 덮어쓰기(update), 무시 등

    db.analysis.insert_one({
        "name": product_name,
        "result": result
    })