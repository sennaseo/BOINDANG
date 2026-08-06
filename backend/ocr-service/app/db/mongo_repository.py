from datetime import datetime

from pymongo import MongoClient
from app.config import get_settings

# 호스트를 ocr-db 로 하드코딩하면 로컬 compose 밖(prod)에서 못 붙는다 — URI는 env 로
settings = get_settings()
client = MongoClient(settings.MONGODB_URI)
db = client[settings.DB_NAME]

print("DB name:", db.name)

def save_product(image_urls:dict, product_name, result):
    print("🧪 save_product() 함수 시작")

    # 제품명 기반 upsert 는 폐기: 필터가 {"name": ...} 인데 $set 에 name 이 없어
    # 제품명을 못 읽은 건들이 전부 같은 문서(name=null)를 덮어썼다.
    # 리포트는 촬영 건별 기록이므로 매번 새 문서로 남긴다.
    inserted = db.product.insert_one({
        "name": product_name,
        "ingredientImageUrl": image_urls["ingredient_image_url"],
        "nutritionImageUrl": image_urls["nutrition_image_url"],
        "result": result,
        "updatedAt": datetime.utcnow()
    })

    print(f"✅ 저장 완료 - product_id: {inserted.inserted_id}")
    return str(inserted.inserted_id)  # 문자열로 변환해서 반환
