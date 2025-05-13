from pymongo import MongoClient
from app.config import get_settings
from urllib.parse import quote_plus
import os

settings = get_settings()
username = quote_plus(os.environ["DB_USERNAME"])
password = quote_plus(os.environ["DB_PASSWORD"])
dbname = os.environ["DB_NAME"]
MONGODB_URI = f"mongodb://{username}:{password}@ocr-db:27017/{dbname}"

client = MongoClient(MONGODB_URI)
db = client[dbname]

print("Mongo URI:", MONGODB_URI)
print("DB name:", db.name)

def save_product(product_name, result):
    print("🧪 save_product() 함수 시작")  # 제일 위에 추가해봐
    db.product.insert_one({
        "name": product_name,
        "result": result
    })


