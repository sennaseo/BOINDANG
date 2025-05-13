# app/utils/parser.py

def clean_texts(ingredient_text: str, nutrition_text: str) -> str:
    # 여기에 정규표현식 기반 정제 로직 작성
    cleaned_ingredient = ingredient_text.strip()
    cleaned_nutrition = nutrition_text.strip()

    return f"원재료: {cleaned_ingredient}\n영양정보: {cleaned_nutrition}"
