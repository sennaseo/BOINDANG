-- BOINDANG 단일 MySQL 인스턴스: DB 5개 + 앱 계정 1개
-- 이 파일은 mysql:8.0 컨테이너의 /docker-entrypoint-initdb.d/ 에 마운트되어
-- "빈 데이터 디렉토리 최초 기동" 시 1회만 실행된다. (이미 볼륨이 있으면 실행 안 됨)
--
-- 서비스별 DB 매핑:
--   boindang_user      <- boindang-user
--   boindang_campaign  <- campaign
--   boindang_community <- community
--   boindang_quiz      <- quiz
--   encyclopedia_db    <- encyclopedia  (02-...sql 로 마스터 데이터 시드됨)
-- (nutrition-service, ocr-service 는 MongoDB / image-service 는 아래 boindang_user... 아님!
--  image-service 도 MySQL 을 쓰므로 별도 DB 가 필요하면 여기에 추가하되,
--  application.yml 상 DB_URL 을 어디로 줄지 .env 에서 결정한다.
--  기본은 image-service 를 boindang_user 와 다른 image DB 로 분리하지 않고
--  .env 에서 IMAGE_DB_URL 을 아래 5개 중 하나(또는 신규)로 지정한다.)

CREATE DATABASE IF NOT EXISTS boindang_user      CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS boindang_campaign  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS boindang_community CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS boindang_quiz      CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS encyclopedia_db    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS boindang_image     CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- 앱 계정 권한 확장:
-- mysql:8.0 entrypoint 가 MYSQL_USER/MYSQL_PASSWORD 로 만든 계정('boindang')은
-- MYSQL_DATABASE 한 곳에만 권한이 붙는다. init 스크립트는 그 계정 생성 "이후" 실행되므로
-- 여기서는 CREATE USER IF NOT EXISTS(이미 존재 → no-op, 비밀번호는 entrypoint 값 유지) 후
-- 나머지 DB 에 대한 권한만 GRANT 로 확장한다.
-- ⚠ 컴포즈의 MYSQL_USER 를 'boindang' 이 아닌 다른 이름으로 바꾸면 아래 계정명도 같이 바꿀 것.
CREATE USER IF NOT EXISTS 'boindang'@'%' IDENTIFIED BY 'set-in-compose-MYSQL_PASSWORD';

GRANT ALL PRIVILEGES ON boindang_user.*      TO 'boindang'@'%';
GRANT ALL PRIVILEGES ON boindang_campaign.*  TO 'boindang'@'%';
GRANT ALL PRIVILEGES ON boindang_community.* TO 'boindang'@'%';
GRANT ALL PRIVILEGES ON boindang_quiz.*      TO 'boindang'@'%';
GRANT ALL PRIVILEGES ON encyclopedia_db.*    TO 'boindang'@'%';
GRANT ALL PRIVILEGES ON boindang_image.*     TO 'boindang'@'%';
FLUSH PRIVILEGES;
