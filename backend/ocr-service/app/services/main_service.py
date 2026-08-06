# app/services/main_service.py

import asyncio
from app.services.gpt_service import ask_gpt_ingredient, ask_gpt_nutrition
from app.db.mongo_repository import save_product


# 🧠 이미지 → GPT vision 하나의 흐름을 처리하는 함수
# CLOVA OCR 제거: clovaocr-api-kr.ncloud.com은 NCP 내부망 전용이라 외부에서 연결 불가
async def ocr_and_gpt(image_url: str, mode: str):
    if mode == "ingredient":
        result = await ask_gpt_ingredient(image_url)
    elif mode == "nutrition":
        result = await ask_gpt_nutrition(image_url)
    else:
        raise ValueError("Invalid mode: must be 'ingredient' or 'nutrition'")

    return result


# 🧪 병렬 처리 메인 서비스
async def process_images(image_urls: dict, ingredient_url: str, nutrition_url: str):
    print("🚀 [비동기 OCR → GPT 병렬 실행 시작]")

    # 두 흐름을 병렬로 실행
    result_ingredient, result_nutrition = await asyncio.gather(
        ocr_and_gpt(ingredient_url, "ingredient"),
        ocr_and_gpt(nutrition_url, "nutrition")
    )

    print("🎯 [GPT 분석 완료]")

    result = {
        "ingredientAnalysis": result_ingredient,
        "nutritionAnalysis": result_nutrition
    }

    # 제품명 추출
    # GPT 가 basicInfo/name 을 명시적 null 로 보내면 .get(key, default) 는 default 를 안 쓴다
    # → null 이 그대로 흘러 프론트의 'Unknown Product' 차단을 우회했다. or 로 막는다.
    product_name = (result_ingredient.get("basicInfo") or {}).get("name") or "Unknown Product"

    # MongoDB 저장
    inserted_id = save_product(image_urls, product_name, result)

    response = {
        "productId": inserted_id,
        "productName": product_name,
        "result": result,
    }

    print(f"✅ 제품 분석 완료 - 제품명: {product_name}, ID: {inserted_id}")
    return response
