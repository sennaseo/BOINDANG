# app/utils/parser.py

import re

def clean_ingredient_text(text: str) -> str:
    # 불필요한 키워드 제거
    trash_keywords = [
        "포장재질", "품목", "업소명",
        "보고번호", "소재지", "고객상담실", "교환 및 반품", "부정.*?1399", "보관해 주십시오",
        "직사광선을.*?보관", "www\\..*", "http[s]?://.*", "전화[:：]?", "소비자 기본법.*",
        "구입한 곳", "식품의약품안전처",
        "상담실", "신고는 국번없이.*?", "080[-\\d]+", "서울\\)?\\d{3}[-]\\d{4}"
    ]
    for keyword in trash_keywords:
        text = re.sub(keyword, '', text, flags=re.IGNORECASE)

    print(text)
    return text.strip()
