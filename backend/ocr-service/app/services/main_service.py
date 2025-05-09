# app/services/main_service.py

from app.services.ocr_service import call_clova_ocr_with_url
from app.services.gpt_service import ask_gpt_ingredient, ask_gpt_nutrition
from app.db.mongo_repository import save_analysis  # Mongo 저장 함수 import

# OCR + GPT
async def process_images(ingredient_url: str, nutrition_url: str):
    # S3에 저장한 img1, img2의 url을 넣어줌.
    ing_text = await call_clova_ocr_with_url(ingredient_url)
    nut_text = await call_clova_ocr_with_url(nutrition_url)

    print("[원재료 OCR 결과]:", ing_text)
    print("[영양정보 OCR 결과]:", nut_text)


    # TODO: 여기에 텍스트 정제 과정을 넣어줘야 함. 정제된 텍스트를 GPT로 넘겨주기
    # utils의 parser.py 수정해주기


    print("\n🤖 [GPT 분석 시작]")
    result_ingredient = await ask_gpt_ingredient(ing_text)
    result_nutrition = await ask_gpt_nutrition(nut_text)

    print("🎯 [GPT 분석 완료]")
    result = {
        "ingredient_analysis": result_ingredient,
        "nutrition_analysis": result_nutrition
    }

    # 제품명 추출
    product_name = result_ingredient.get("basicInfo", {}).get("name", "Unknown Product")

    # MongoDB 저장
    save_analysis(product_name, result)
    print(f"✅ MongoDB 저장 완료 - 제품명: {product_name}")

    return result