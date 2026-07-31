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
        "temperature": 0.3,
        "response_format": {"type": "json_object"}
    }

    print("\n🚀 [GPT 호출 시작]")
    print("🔸 메시지:", messages)

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(GPT_API_URL, headers=headers, json=payload)
            response.raise_for_status()
        except (httpx.TimeoutException, httpx.HTTPStatusError) as e:
            if isinstance(e, httpx.HTTPStatusError) and e.response.status_code < 500:
                raise
            # 타임아웃 또는 5xx 응답에 한해 1회만 재시도
            response = await client.post(GPT_API_URL, headers=headers, json=payload)
            response.raise_for_status()
        data = response.json()

    print("✅ [GPT 응답 수신 완료]")
    print("🔹 응답 내용:", data)

    return data["choices"][0]["message"]["content"]


async def ask_gpt_ingredient(image_url: str) -> dict:
    system_prompt = (
        """
        너는 식품 성분 분석 전문가다. 아래 성분 텍스트를 분석하여 다음 JSON 구조로 요약하라.
        사족 없이 JSON만 반환할 것.

        1. basicInfo
        name: 제품명 (있을 경우)
        totalWeightGram, pakageGram, pakages: 총중량, 개별 포장 중량, 포장 개수

         2. ingredientTree
        괄호는 하위 성분이며 중첩은 children 배열로 구조화한다.
        % 표시는 ratio로 반영하고, order는 상위 항목에만 부여한다.
        각 노드는 다음 필드를 반드시 포함해야 한다:
          - name: 성분명 (필수)
          - origin: 원산지 또는 null
          - order: 상위 성분일 경우에만 숫자 (하위 성분은 null)
          - children: 하위 성분 노드 리스트 (없으면 빈 배열 [])
        
        모든 노드는 children 필드를 반드시 포함하며, 하위 성분이 없더라도 "children": [] 으로 나타내야 한다.
        
        단, 괄호 안이 '감미료', '산도조절제', '유화제' 등 용도 설명일 경우에는 children에 포함하지 말고 무시할 것.
        - 단, 괄호 안에 용도와 함께 실제 성분이 명시되어 있다면(예: 감미료/에리스리톨), **용도는 무시하고 성분은 children에 포함**

        3. categorizedIngredients
        성분을 용도별로 분류
        분류 항목: 감미료, 산도조절제, 유화제, 점질제, 착향료, 착색료, 보존제, 산화방지제, 팽창제, 염류, 보충제, 기타
        괄호 안 용도 설명은 여기에 반영할 것

        4. 종합 gi 지수
        원재료의 등장 순서 및 함량 비율 등에 따라 해당 식품의 GI 지수를 예측하라.
        GI지수와 등급(안심, 주의, 위험)을 포함할 것
        
        5. summary
        전체 원재료 구성의 영양학적 특성을 한 줄로 요약할 것 (예: "감미료와 정제유지가 다량 포함되어 혈당과 체지방 증가에 주의가 필요합니다.")
        
        결과는 아래 JSON 형식만 반환할 것:
        {
          "basicInfo": {...},
          "ingredientTree": [...],
          "categorizedIngredients": {...},
          "giIndex": {value: ..., grade:"..."}
          "summary": "..."
        }
        """
    )

    raw_content = await call_gpt_api([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": [
            {"type": "text", "text": "다음 제품 사진의 원재료명(성분) 표기를 읽고 분석하라."},
            {"type": "image_url", "image_url": {"url": image_url}}
        ]}
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


async def ask_gpt_nutrition(image_url: str) -> dict:
    system_prompt = (
    """
    너는 식품 영양정보 분석 전문가다. 아래 텍스트를 분석해 영양 성분을 요약하라.
    사족 없이 JSON만 반환할 것.

    대상: 영양정보 텍스트

    1. nutrition
    - carbohydrate, protein, fat 구조로 나눌 것
    - 각 항목: gram, ratio 포함

    2. summary
    - 해당 제품의 영양학적 특성을 한 문장으로 요약 (예: "지방 함량이 높은 고열량 식품입니다.")
    
    아래 형식의 JSON만 반환하라:
    {
      "nutrition": {
        "Kcal": ...,
        "carbohydrate": {
          "gram": ...,
          "ratio": ...,
          "sub": {
            "sugar": { "gram": ..., "ratio": ... },
            "fiber": { "gram": ..., "ratio": ... }
          }
        },
        "protein": { "gram": ..., "ratio": ... },
        "fat": {
          "gram": ..., "ratio": ...,
          "sub": {
            "saturatedFat": { "gram": ..., "ratio": ... },
            "transFat": { "gram": ..., "ratio": ... },
            "unsaturatedFat": { "gram": ..., "ratio": ... }
          }
        },
        "sodium": { "mg": ..., "ratio": ... },
        "cholesterol": { "mg": ..., "ratio": ... }
      },
      "summary": "..."
    }
    """
    )

    raw_content = await call_gpt_api([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": [
            {"type": "text", "text": "다음 제품 사진의 영양정보표를 읽고 분석하라."},
            {"type": "image_url", "image_url": {"url": image_url}}
        ]}
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
