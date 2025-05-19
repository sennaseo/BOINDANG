from datetime import datetime

from pymongo import MongoClient
from app.config import get_settings
from urllib.parse import quote_plus
import os

username = quote_plus(os.environ["DB_USERNAME"])    # url에 특수문자가 들어가면 안되기 때문에 변환해줌
password = quote_plus(os.environ["DB_PASSWORD"])
dbname = os.environ["DB_NAME"]
MONGODB_URI = f"mongodb://{username}:{password}@ocr-db:27017/{dbname}?authSource=admin"

client = MongoClient(MONGODB_URI)
db = client[dbname]

print("Mongo URI:", MONGODB_URI)
print("DB name:", db.name)

def save_product(image_urls:dict, product_name, result):
    print("🧪 save_product() 함수 시작")

    # upsert 시도
    update_result = db.product.update_one(
        {"name": product_name},
        {
            "$set": {
                "ingredientImageUrl": image_urls["ingredient_image_url"],
                "nutritionImageUrl": image_urls["nutrition_image_url"],
                "result": result,
                "updatedAt": datetime.utcnow()
            }
        },
        upsert=True
    )

    # _id 가져오기: 삽입된 경우 → upserted_id, 아닌 경우 → 기존 문서 조회
    if update_result.upserted_id:
        inserted_id = update_result.upserted_id
    else:
        # name이 같은 기존 문서 조회해서 _id 반환
        existing_doc = db.product.find_one({"name": product_name})
        inserted_id = existing_doc["_id"]

    print(f"✅ 저장 완료 - product_id: {inserted_id}")
    return str(inserted_id)  # 문자열로 변환해서 반환
