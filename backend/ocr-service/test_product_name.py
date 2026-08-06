"""제품명 추출 자체 점검 — python backend/ocr-service/test_product_name.py

GPT 응답이 basicInfo/name 을 명시적 null 로 보내는 경우가 실제로 있었고,
.get(key, default) 는 그때 default 를 쓰지 않아 null 이 DB 까지 흘렀다.
main_service 의 추출식과 동일한 식을 여기서 검증한다.
"""


def extract_product_name(result_ingredient: dict) -> str:
    # main_service.process_images 와 동일한 식
    return (result_ingredient.get("basicInfo") or {}).get("name") or "Unknown Product"


def demo():
    # 정상: 이름이 잡힌 경우
    assert extract_product_name({"basicInfo": {"name": "제로콜라"}}) == "제로콜라"

    # 실제 장애 케이스: name 이 명시적 null → 예전 코드는 None 을 그대로 반환했다
    assert extract_product_name({"basicInfo": {"name": None}}) == "Unknown Product"

    # basicInfo 자체가 null
    assert extract_product_name({"basicInfo": None}) == "Unknown Product"

    # 키가 아예 없음
    assert extract_product_name({}) == "Unknown Product"

    # 빈 문자열도 이름으로 쓰면 안 된다
    assert extract_product_name({"basicInfo": {"name": ""}}) == "Unknown Product"

    print("OK - product name extraction")  # cp949 콘솔 대비: 이모지/한글 금지


if __name__ == "__main__":
    demo()
