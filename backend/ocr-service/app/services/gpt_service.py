import httpx
import json
import os
from app.config import get_settings

settings = get_settings()
GPT_API_URL = settings.OPENAI_API_URL
GPT_API_KEY = settings.OPENAI_API_KEY

OUTPUT_DIR = "app/services/outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


async def call_gpt_api(messages: list[dict]) -> str:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GPT_API_KEY}"
    }

    payload = {
        "model": "gpt-4.1-mini",
        "messages": messages,
        "max_tokens": 4096,
        "temperature": 0.3
    }

    print("\n🚀 [GPT 호출 시작]")
    print("🔸 메시지:", messages)

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(GPT_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    print("✅ [GPT 응답 수신 완료]")
    print("🔹 응답 내용:", data)

    return data["choices"][0]["message"]["content"]


async def ask_gpt_ingredient(ingredient_text: str) -> dict:
    system_prompt = (
        """
        너는 식품 성분 분석 전문가다. 아래 성분 텍스트를 분석하여 다음 JSON 구조로 요약하라.
        사족 없이 JSON만 반환할 것.

        1. basicInfo
        name: 제품명 (있을 경우)
        totalWeightGram, pakageGram, pakages: 총중량, 개별 포장 중량, 포장 개수

        2. ingredientTree
        괄호는 하위 성분이며 중첩은 children 배열로 구조화
        % 표시는 ratio로 반영, 부모 항목에만 order 부여
        단, 괄호 안이 '감미료', '산도조절제', '유화제' 등 용도 설명일 경우에는 children에 포함하지 말고 무시할 것
        - 단, 괄호 안에 용도와 함께 실제 성분이 명시되어 있다면(예: 감미료/에리스리톨), **용도는 무시하고 성분은 children에 포함**

        3. categorizedIngredients
        성분을 용도별로 분류
        분류 항목: 감미료, 산도조절제, 유화제, 점질제, 착향료, 착색료, 보존제, 산화방지제, 팽창제, 염류, 보충제, 기타
        괄호 안 용도 설명은 여기에 반영할 것

        결과는 아래 JSON 형식만 반환할 것:
        {
          "basicInfo": {...},
          "ingredientTree": [...],
          "categorizedIngredients": {...}
        }
        """
    )

    raw_content = await call_gpt_api([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"분석 대상 텍스트:\n{ingredient_text}"}
    ])

    try:
        parsed = json.loads(raw_content)
        with open(os.path.join(OUTPUT_DIR, "ingredient_result.json"), "w", encoding="utf-8") as f:
            json.dump(parsed, f, ensure_ascii=False, indent=2)
        print("✅ [ingredient_result.json 저장 완료]")
        return parsed  # ✅ dict 반환
    except json.JSONDecodeError as e:
        print("❌ JSON 파싱 실패:", e)
        return {"error": "Invalid JSON response from GPT"}


async def ask_gpt_nutrition(nutrition_text: str) -> dict:
    system_prompt = (
    """
    너는 식품 영양정보 분석 전문가다. 아래 텍스트를 분석해 영양 성분을 요약하라.
    사족 없이 JSON만 반환할 것.

    대상: 영양정보 텍스트

    1. nutritionSummary
    - carbohydrate, protein, fat 구조로 나눌 것
    - 각 항목: gram, ratio 포함
    - fat은 sub 항목(saturatedFat, transFat, unsaturatedFat) 포함 가능

    아래 형식의 JSON만 반환하라:

    {
      "nutritionSummary": {
          "Kcal": ...,
        "carbohydrate": { "gram": ..., "ratio": ...},
        "protein": { "gram": ..., "ratio": ...},
        "fat": {
          "gram": ..., "ratio": ...,
          "sub": {
            "saturatedFat": { "gram": ..., "ratio": ... },
            "transFat": { "gram": ..., "ratio": ... },
            "unsaturatedFat": { "gram": ..., "ratio": ... }
          }
        }
      }
    }
    """
    )

    raw_content = await call_gpt_api([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"영양정보 텍스트:\n{nutrition_text}"}
    ])

    try:
        parsed = json.loads(raw_content)
        with open(os.path.join(OUTPUT_DIR, "nutrition_result.json"), "w", encoding="utf-8") as f:
            json.dump(parsed, f, ensure_ascii=False, indent=2)
        print("✅ [nutrition_result.json 저장 완료]")
        return parsed  # ✅ dict 반환
    except json.JSONDecodeError as e:
        print("❌ JSON 파싱 실패:", e)
        return {"error": "Invalid JSON response from GPT"}
