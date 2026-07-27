#!/usr/bin/env python3
"""
BOINDANG Elasticsearch 시드 스크립트.

왜 필요한가:
  encyclopedia 의 자동 로더(ElasticsearchTestDataLoader / IngredientTestDataLoader)는
  @Profile("test") 라서 프로덕션에선 실행되지 않는다. 즉 ES 인덱스 `ingredients` 는
  encyclopedia 가 뜰 때 (spring.elasticsearch.index.auto-create=true 로) 매핑만 자동 생성되고
  "데이터는 비어 있다". 실제 마스터 성분 데이터는 MySQL `encyclopedia_db.encyclopedia_json`
  테이블의 JSON 컬럼에 들어있으므로, 그걸 읽어 ES 인덱스 `ingredients` 로 bulk 색인한다.

  런타임 검색 코드(EncyclopediaService/AutocompleteSearchService/FuzzySearchService/
  PopularIngredientService)는 전부 인덱스명 `ingredients` 에 대해 name/category/name.keyword
  필드로 질의한다. JSON 컬럼(data)이 곧 IngredientDictionary(@Document indexName="ingredients")
  형태라서 그대로 색인하면 검색에 필요한 필드가 다 들어간다.

의존성: 표준 라이브러리 + requests. (MySQL 은 별도 드라이버 없이 `docker exec ... mysql` 로 읽음)

실행 시점: encyclopedia 서비스가 최소 1회 떠서 `ingredients` 인덱스가 생성된 "이후"에 1회 실행.
  (인덱스가 없으면 아래에서 만들지 못하는 건 아니지만, 앱이 만든 매핑을 그대로 쓰는 게 안전)

사용법:
  cd deploy
  python3 seed-es.py                       # 기본값(아래 상수) 사용
  ES_URL=http://localhost:9200 MYSQL_CONTAINER=boindang-mysql \
    MYSQL_ROOT_PASSWORD=xxx python3 seed-es.py
"""
import json
import os
import subprocess
import sys

import requests

ES_URL = os.environ.get("ES_URL", "http://localhost:9200")
INDEX = os.environ.get("ES_INDEX", "ingredients")
MYSQL_CONTAINER = os.environ.get("MYSQL_CONTAINER", "boindang-mysql")
MYSQL_ROOT_PASSWORD = os.environ.get("MYSQL_ROOT_PASSWORD", "")
MYSQL_DB = os.environ.get("MYSQL_DB", "encyclopedia_db")


def fetch_rows():
    """MySQL 컨테이너에서 encyclopedia_json 을 JSON 배열로 읽어온다."""
    # 각 행을 하나의 JSON 오브젝트로 뽑아 개행 구분(JSON Lines)으로 받는다.
    # data 는 이미 JSON 컬럼이라 JSON_OBJECT 로 감싸면 문자열로 이스케이프되므로
    # 대신 id/name/data 를 탭 구분으로 뽑고 파이썬에서 data 를 json.loads 한다.
    sql = (
        "SELECT id, COALESCE(name, ''), "
        "COALESCE(CAST(data AS CHAR), '{}') FROM encyclopedia_json;"
    )
    cmd = [
        "docker", "exec", "-i", MYSQL_CONTAINER,
        "mysql", "-uroot", f"-p{MYSQL_ROOT_PASSWORD}",
        MYSQL_DB, "--batch", "--raw", "--skip-column-names",
        "--default-character-set=utf8mb4", "-e", sql,
    ]
    out = subprocess.run(cmd, capture_output=True, check=True).stdout.decode("utf-8")
    rows = []
    for line in out.splitlines():
        if not line.strip():
            continue
        parts = line.split("\t", 2)
        if len(parts) != 3:
            print(f"⚠ 건너뜀(파싱 실패): {line[:80]}", file=sys.stderr)
            continue
        _id, name, data_raw = parts
        try:
            doc = json.loads(data_raw) if data_raw and data_raw != "NULL" else {}
        except json.JSONDecodeError:
            doc = {}
        doc["id"] = _id
        # data JSON 에 name 이 없거나 비면 컬럼 name 으로 보정
        if not doc.get("name"):
            doc["name"] = name
        rows.append(doc)
    return rows


def bulk_index(rows):
    """ES _bulk API 로 색인. _id 는 성분 id 사용(재실행해도 덮어쓰기=멱등)."""
    lines = []
    for doc in rows:
        lines.append(json.dumps({"index": {"_index": INDEX, "_id": doc["id"]}}))
        lines.append(json.dumps(doc, ensure_ascii=False))
    payload = "\n".join(lines) + "\n"
    resp = requests.post(
        f"{ES_URL}/_bulk",
        data=payload.encode("utf-8"),
        headers={"Content-Type": "application/x-ndjson"},
        timeout=60,
    )
    resp.raise_for_status()
    body = resp.json()
    if body.get("errors"):
        # 어떤 항목이 실패했는지 첫 에러만 보여준다.
        for item in body["items"]:
            res = item.get("index", {})
            if res.get("error"):
                print(f"❌ 색인 실패 {res.get('_id')}: {res['error']}", file=sys.stderr)
                break
        raise SystemExit("일부 문서 색인 실패")
    return len(rows)


def main():
    if not MYSQL_ROOT_PASSWORD:
        raise SystemExit("MYSQL_ROOT_PASSWORD 환경변수를 설정하세요.")
    rows = fetch_rows()
    if not rows:
        raise SystemExit("encyclopedia_json 에서 읽은 행이 없습니다. 02-encyclopedia.sql 시드 확인.")
    n = bulk_index(rows)
    # 색인 반영 강제(즉시 검색 확인용)
    requests.post(f"{ES_URL}/{INDEX}/_refresh", timeout=30)
    count = requests.get(f"{ES_URL}/{INDEX}/_count", timeout=30).json().get("count")
    print(f"✅ ES 인덱스 '{INDEX}' 에 {n}건 색인 완료. 현재 문서 수={count}")


if __name__ == "__main__":
    main()
