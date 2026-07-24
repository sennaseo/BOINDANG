# app/services/ocr_service.py

import httpx
from app.config import get_settings
import uuid
import time


settings = get_settings()
ocr_url = settings.CLOVA_OCR_API_URL
ocr_secret = settings.CLOVA_OCR_SECRET_KEY

# ✅ 테스트용: S3 URL 등 임의 URL로 OCR 요청
async def call_clova_ocr_with_url(image_url: str) -> str:
    headers = {
        "X-OCR-SECRET": ocr_secret,
        "Content-Type": "application/json"
    }

    body = {
        "version": "V1",
        "requestId": str(uuid.uuid4()),
        "timestamp": int(time.time() * 1000),  # 현재 시각 (밀리초 단위)
        "lang": "ko",
        "images": [
            {
                "format": "jpg",
                "name": "test-image",
                "url": image_url
            }
        ]
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(ocr_url, headers=headers, json=body)
            response.raise_for_status()
        except (httpx.TimeoutException, httpx.HTTPStatusError) as e:
            if isinstance(e, httpx.HTTPStatusError) and e.response.status_code < 500:
                raise
            # 타임아웃 또는 5xx 응답에 한해 1회만 재시도
            response = await client.post(ocr_url, headers=headers, json=body)
            response.raise_for_status()
        data = response.json()

    fields = data.get("images", [])[0].get("fields", [])
    return ' '.join(field.get("inferText", "") for field in fields)
