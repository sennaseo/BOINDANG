from pymongo import MongoClient
from app.config import get_settings

settings = get_settings()

MONGODB_URI = settings.MONGODB_URI

client = MongoClient(MONGODB_URI)
db = client["nutrition_db"]

print("Mongo URI:", settings.MONGODB_URI)
print("DB name:", db.name)

def save_product(product_name, result):
    print("🧪 save_product() 함수 시작")  # 제일 위에 추가해봐
    db.product.insert_one({
        "name": product_name,
        "result": result
    })


