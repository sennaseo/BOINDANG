# BOINDANG 배포 (Oracle A1.Flex, ARM/aarch64, Ubuntu 24.04)

단일 서버에 BOINDANG 전체 스택(인프라 6 + 앱 12)을 하나의 docker compose 로 올린다.
같은 서버에 **BBANGGU 가 이미 호스트 80 포트를 점유**하고 있으므로, BOINDANG 은
컨테이너 내부에서만 서비스를 열고 **공유 프록시(nginx)** 를 통해 외부에 노출한다.

- 프론트: `https://boindang.duckdns.org`
- API: `https://boindang.duckdns.org/api/` → gateway (same-origin, httpOnly 쿠키 인증)

---

## 0. 사전 준비 (senna 가 발급해야 할 것)

| 항목 | 어디에 |
|---|---|
| `JWT_SECRET` (32자+ 랜덤) | `.env.prod` — `openssl rand -base64 48` |
| MySQL root/앱 비밀번호 | `.env.prod` |
| MongoDB root/앱 계정·비번·URI | `.env.prod` |
| **CLOVA OCR** API URL + Secret Key | 네이버 클라우드 콘솔 → OCR |
| **OpenAI** API URL + Key | platform.openai.com |
| **AWS S3** 버킷/AccessKey/SecretKey/Region | 기존 버킷 재사용 권장 (CloudFront 도메인 유지) |
| **DuckDNS** `boindang` 서브도메인 | 이 서버 공인 IP 로 A 레코드 갱신 |

> ⚠ 이미지 CDN 은 image-service 코드에 CloudFront 도메인(`d1d5plumlg2gxc.cloudfront.net`)이
> 하드코딩돼 있다. **기존 S3 버킷/CloudFront 배포를 그대로 재사용하면 그대로 동작**한다.
> 버킷을 새로 만든다면 `backend/image-service/.../ImageService.java` 의 URL 과
> `NEXT_PUBLIC_CDN_BASE_URL`, `frontend/.../next.config.ts` 의 `images.domains` 를 함께 바꿔야 한다.

---

## 1. 배포 절차

### (1) 클론 & 환경파일
```bash
git clone https://github.com/sennaseo/BOINDANG.git ~/BOINDANG
cd ~/BOINDANG/deploy
cp .env.prod.example .env.prod
vi .env.prod        # 위 표의 값 채우기
```

### (2) Java 서비스 JAR 먼저 빌드 (중요)
각 서비스 Dockerfile 은 소스에서 빌드하지 않고 `./build/libs/*.jar` 를 **ADD** 한다.
따라서 `docker compose build` 전에 gradle 로 JAR 을 만들어 둬야 한다.
JDK 17 이 없으면 gradle wrapper 가 도구를 받아오지만, ARM 서버에서 한 번에:

```bash
cd ~/BOINDANG/backend
for s in eureka gateway auth boindang-user campaign community quiz encyclopedia nutrition-service image-service; do
  (cd "$s" && ./gradlew clean bootJar -x test) || { echo "FAILED: $s"; break; }
done
```
> ocr-service(FastAPI)·frontend(Next)는 Dockerfile 이 소스에서 빌드하므로 gradle 불필요.

### (3) 공유 네트워크 생성 (최초 1회)
```bash
docker network create proxy-net
```

### (4) 스택 기동
```bash
cd ~/BOINDANG/deploy
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```
인프라(mysql/mongo/redis/es/kafka) → eureka → 앱 순서로 healthcheck 를 기다렸다가 뜬다.
전체 기동은 ARM 4코어에서 2~4분 정도.

### (5) Elasticsearch 시드 (필수, 자동 아님)
encyclopedia 의 ES 자동 로더는 `@Profile("test")` 라 **프로덕션에선 데이터가 안 채워진다.**
encyclopedia 가 한 번 떠서 `ingredients` 인덱스가 생성된 뒤 아래를 1회 실행:

```bash
cd ~/BOINDANG/deploy
python3 -m pip install requests    # 최초 1회
MYSQL_ROOT_PASSWORD=<루트비번> python3 seed-es.py
# → "✅ ES 인덱스 'ingredients' 에 N건 색인 완료" 확인
```
> 재실행해도 `_id=성분id` 로 덮어쓰기(멱등)라 안전하다.
> 데이터 소스는 MySQL `encyclopedia_db.encyclopedia_json`(02-encyclopedia.sql 로 시드됨).

### (6) TLS 인증서 (certbot, webroot)
공유 프록시 nginx 가 80 을 서빙하는 상태에서:
```bash
# webroot 디렉토리 준비 (프록시 nginx 의 /var/www/certbot 와 매핑)
sudo certbot certonly --webroot -w /var/www/certbot \
  -d boindang.duckdns.org --email <메일> --agree-tos
# 발급 후 nginx reload
```
`deploy/nginx/boindang.conf` 를 프록시 nginx 의 conf.d 에 넣고 `nginx -s reload`.

---

## 2. BBANGGU 공유 프록시 전환

현재 BBANGGU 가 호스트 80 을 직접 물고 있다. BOINDANG 을 같이 노출하려면 **프록시 nginx 1개**가
80/443 을 잡고 `server_name`(도메인)으로 두 프로젝트를 분기하게 만든다.

1. 프록시용 nginx 컨테이너를 하나 띄우고 `proxy-net` 에 연결
   (BOINDANG 의 gateway·frontend, BBANGGU 의 프론트·게이트웨이가 모두 이 네트워크에 붙어야
   nginx 가 컨테이너 이름으로 `proxy_pass` 가능).
2. BBANGGU 컨테이너에서 `ports: - "80:..."` 호스트 바인딩을 제거하고 `proxy-net` 에 join.
3. 프록시 nginx 의 conf.d 에 BBANGGU vhost + `deploy/nginx/boindang.conf` 두 개를 둔다.
4. `boindang.conf` 의 `proxy_pass http://gateway:8000/;` / `http://frontend:3000/;` 는
   **컨테이너 이름 기준**이라, 두 프로젝트의 서비스명이 겹치지 않는지 확인
   (BOINDANG gateway/frontend 컨테이너명은 `boindang-gateway`/`boindang-frontend` 지만
   compose 서비스명은 `gateway`/`frontend` → 프록시가 join 한 네트워크의 DNS 는 서비스명으로 해석됨.
   BBANGGU 쪽에 같은 이름이 있으면 프로젝트 프리픽스로 구분되므로 대개 문제없음).

> ⚠ 주의: `proxy_pass` 대상은 nginx 가 붙은 네트워크에서 **해석 가능한 이름**이어야 한다.
> 전환 시엔 프록시 nginx 를 `boindang-net` + `proxy-net` 양쪽이 아니라 `proxy-net` 에 두고,
> BOINDANG gateway/frontend 를 `proxy-net` 에도 노출(이미 compose 에 설정됨)했는지 확인.

---

## 3. 메모리 예산표 (`mem_limit` 합계)

| 구분 | 서비스 | limit | 비고 |
|---|---|---:|---|
| 인프라 | mysql | 1500m | DB 6개 |
| | mongo | 700m | |
| | redis | 200m | maxmemory 128m |
| | elasticsearch | 1200m | heap 512m |
| | kafka | 700m | KRaft 단일 |
| 앱(Java) | eureka | 512m | Xmx256m |
| | gateway | 512m | |
| | auth | 512m | |
| | boindang-user | 512m | |
| | campaign | 512m | |
| | community | 512m | |
| | quiz | 512m | |
| | encyclopedia | 640m | Xmx384m |
| | nutrition-service | 512m | |
| | image-service | 512m | |
| 앱(기타) | ocr-service | 700m | Python+opencv |
| | frontend | 512m | Next start |
| **합계** | | **~10.5GB** | limit 은 상한이며 실제 사용은 이보다 낮다. RSS 기준 실사용은 대개 6~8GB. |

> 24GB 서버에서 BBANGGU(~수 GB)와 공존 가능. limit 합계가 8GB 를 넘지만 이는 상한이고,
> Java 앱들은 Xmx256m + 메타스페이스/스레드로 실제 300~400m 수준. 빠듯하면
> community/quiz 처럼 트래픽 적은 서비스의 limit 을 384m 로 내려 여유를 만들 수 있다.

---

## 4. 접속 확인 체크리스트

```bash
# 컨테이너 상태 (전부 healthy/up)
docker compose -f docker-compose.prod.yml ps

# eureka 등록 확인 (앱 11개가 UP 으로 보여야 함)
curl -s http://localhost:8761/ | grep -o 'Instances currently registered.*' | head

# 게이트웨이 직접 (컨테이너 내부망) - encyclopedia 검색
docker exec boindang-gateway curl -s "http://localhost:8000/encyclopedia/search?query=말티톨" | head

# ES 시드 확인
curl -s localhost:9200/ingredients/_count

# 외부 (TLS/도메인)
curl -sI https://boindang.duckdns.org/           # 프론트 200
curl -s  https://boindang.duckdns.org/api/encyclopedia/search?query=말티톨
```

체크 포인트:
- [ ] `docker compose ps` 전부 Up (healthy)
- [ ] eureka 에 11개 앱 등록 (frontend 제외)
- [ ] `/ingredients/_count` 가 0 이 아님 (ES 시드 완료)
- [ ] 프론트 로드 + 로그인 → `access_token`/`refresh_token` 쿠키가 `Secure; HttpOnly; SameSite=Lax` 로 세팅
- [ ] OCR 업로드 → 분석 리포트 생성 (CLOVA/OPENAI 키 유효)
- [ ] 이미지 presigned 업로드 → CloudFront URL 로 표시 (S3 자격증명 유효)

---

## 5. 운영 팁
- 코드 수정 반영: JAR 재빌드(해당 서비스) 후 `docker compose ... up -d --build <서비스>`.
- 로그: `docker compose -f docker-compose.prod.yml logs -f <서비스>`
- ES/Mongo/MySQL 데이터는 named volume(`es_data`/`mongo_data`/`mysql_data`/`kafka_data`)에 영속.
  init 스크립트(01/02 sql, init-mongo.js)는 **볼륨이 비어있는 최초 기동에만** 실행됨 —
  DB 를 다시 시드하려면 해당 볼륨을 지우고 재기동.
