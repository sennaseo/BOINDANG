# 보인당
<img width="2000" height="1124" alt="Image" src="https://github.com/user-attachments/assets/7b6630fd-e200-4467-bfa0-69f6961dd3fa" />
<br>

### 삼성 청년 SW·AI 아카데미(SSAFY) 12th 자율 프로젝트 - 우수상🏆
> 2025.04.14. ~ 2025.05.22. (6주)
<br>

## 목차
1. [프로젝트 소개](#%EF%B8%8F-프로젝트-소개)
2. [주요 기능](#주요-기능)
3. [화면 구성](#-화면-구성)
4. [아키텍처 구성도](#%EF%B8%8F-아키텍처-구성도)
5. [기술 스택](#%EF%B8%8F-기술-스택)
6. [어깨PIZZA 팀원 소개](#-어깨pizza-팀원-소개)
<br>

## 🖥️ 프로젝트 소개
**보인당**은 제품의 **영양정보 표를 촬영하여 원재료 정보 및 사용자 타입별 리포트를 제공하는 서비스**입니다.

이 서비스의 **목적**은 소비자가 '저당', '무가당' 같은 문구에 현혹되지 않고, <strong>제품에 포함된 숨겨진 첨가물 정보(특히 대체당)</strong>를 정확하게 파악하도록 돕는 것입니다. 많은 제품이 표기법상 당류로 분류되지 않는 대체당을 사용해 '저당'으로 판매되지만, 이는 혈당에 영향을 줄 수 있습니다.
**보인당**은 이러한 문제점을 해결하여, 당 관련 질환을 앓고 있거나 혈당 관리를 하는 소비자들이 겉 포장 문구가 아닌 **실제 성분에 기반한 현명한 제품 선택**을 할 수 있도록 지원하는 것을 **목표**로 합니다.
<br>
<br>

### [주요 기능]
#### 1. OCR 기반 맞춤형 영양성분 분석
OCR을 이용해 제품의 영양정보를 촬영하면 '텍스트 추출 > 정제 > DB 매칭'의 과정을 거쳐 영양성분 목록을 생성합니다.<br>
생성된 성분 데이터는 사용자별 관심사와 건강 상태를 고려하여, 주의해야할 성분을 파악해 제품의 영양성분 분석 리포트를 제공합니다.

#### 2. 성분 백과사전
제품 촬영 없이 식품성분에 대한 정보를 검색할 수 있습니다.<br>
각 성분 페이지에서는 영양 정보, 건강 영향, 사용자 유형 별 주의사항 등 풍부한 설명을 확인할 수 있으며,<br>
실시간 인기 검색어 Top3와 카테고리별 탐색 기능을 지원해, 사용자는 관심 있는 성분을 빠르게 찾고 탐색할 수 있습니다. 

#### 3. 체험단
신제품이나 특정 식품을 선착순 이벤트 형태로 모집하여, 빠르게 신청한 사용자가 우선적으로 참여할 수 있습니다.

#### 4. 영양퀴즈
식품 성분 및 영양소와 관련된 퀴즈를 제공하여 사용자들이 재미있게 영양 지식을 학습할 수 있도록 합니다.  
퀴즈 결과는 정답 여부와 해설로 피드백을 제공하며, 틀린 문제성
<br>
<br>

## 👀 화면 구성
### 1. 메인 기능（영양성분 분석）
| 홈 화면 | 촬영 가이드 | 분석 진행화면 | 리포트 요약 |
|-----------|-----------|-----------|-----------|
| <img height="500" alt="Image" src="https://github.com/user-attachments/assets/3152220d-6a13-44d5-94a6-c0b97266f876" /> | <img height="500" alt="cameraGuide" src="https://github.com/user-attachments/assets/f526d106-5cf7-462d-9fbf-85d4bf8d13f9" /> | <img height="500" alt="cameraLoading" src="https://github.com/user-attachments/assets/c1dbcb6f-b3dc-41b0-8361-7064361b25a3" /> | <img height="500" alt="report" src="https://github.com/user-attachments/assets/f7106ad4-3646-4599-8432-85bbfc5eaee2" /> |
<br>


### 2. 분석 레포트 상세보기
| 분석 완료 알림 | 안전도 체크 | 성분 구성 | 유저 타입별 주의 성분 |
|-----------|-----------|-----------|-----------|
| <img height="500" alt="2" src="https://github.com/user-attachments/assets/ddec2505-6b7a-463c-975a-e7c9873bf1b7" /> | <img height="500" alt="2-1" src="https://github.com/user-attachments/assets/e2fa2698-010e-4f0c-a92b-e818340c8081" /> | <img height="500" alt="2-2" src="https://github.com/user-attachments/assets/6fb690cc-a521-479b-92bf-c449744752d5" /> | <img height="500" alt="2-3" src="https://github.com/user-attachments/assets/674acd1f-9565-4bc6-a414-33556748d174" /> |
<br>

### 3. 성분 백과사전
| 백과사전 홈 화면 | 성분 검색 | 성분 상세 정보 |
|-----------|-----------|-----------|
| <img height="500" alt="3-1" src="https://github.com/user-attachments/assets/3e333d34-0130-4678-92fd-4b6259bce9cc" /> | <img height="500" alt="3-2" src="https://github.com/user-attachments/assets/3c8c5fea-6739-4fcb-85a6-79b4c3d074e2" /> | <img height="500" alt="3-3" src="https://github.com/user-attachments/assets/ec6753f7-58f7-4681-bc09-7a58bfcb71e0" /> |
<br>

### 4. 영양퀴즈
| 문제 풀기 | 통계 정보 | 오답노트 |
|-----------|-----------|-----------|
| <img height="500" alt="5-1" src="https://github.com/user-attachments/assets/bd934557-bc5c-42bd-b421-ce026c1b02fe" /> | <img height="500" alt="5-2" src="https://github.com/user-attachments/assets/3ef7c05d-b9de-4b9f-bfe3-a502edbdb689" /> | <img height="500" alt="5-3" src="https://github.com/user-attachments/assets/12d6aec8-360d-4b74-8c96-d5bc4452fa85" /> |
<br>

### 5. 체험단 및 마이페이지
| 체험단 상세 화면 | 마이페이지 |
|-----------|-----------|
| <img height="500" alt="4-2" src="https://github.com/user-attachments/assets/d545b3c8-c36b-48f6-863f-2129929c993b" /> | <img height="500" alt="4-3" src="https://github.com/user-attachments/assets/2ea5f89b-7338-456d-8013-4cb8b5b40a71" /> |
<br>

## ⚙️ 아키텍처 구성도
<img width="2470" height="1984" alt="Image" src="https://github.com/user-attachments/assets/00881948-e27e-41c8-8dcb-74e7279f8218" /><br>

## 🛠️ 기술 스택
#### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

#### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat&logo=springsecurity&logoColor=white)
![Spring Cloud Gateway](https://img.shields.io/badge/Spring_Cloud_Gateway-6DB33F?style=flat&logo=spring&logoColor=white)
![Eureka](https://img.shields.io/badge/Eureka-6DB33F?style=flat&logo=spring&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)  
![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=flat&logo=apachekafka&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=flat&logo=elasticsearch&logoColor=white)
![Kibana](https://img.shields.io/badge/Kibana-005571?style=flat&logo=kibana&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

#### CI/CD, Monitoring
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=flat&logo=jenkins&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/Amazon_EC2-FF9900?style=flat&logo=amazonec2&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?style=flat&logo=amazons3&logoColor=white)  
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=flat&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=flat&logo=grafana&logoColor=white)

#### Communication
![GitLab](https://img.shields.io/badge/GitLab-FC6D26?style=flat&logo=gitlab&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=flat&logo=jira&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white)
![Mattermost](https://img.shields.io/badge/Mattermost-0072C6?style=flat&logo=mattermost&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white)
<br>
<br>

## 🩵 어깨PIZZA 팀원 소개
<img width="400" alt="Image" src="https://github.com/user-attachments/assets/b27af16b-0878-40f5-9293-d8313a840e71" /><br>
| 이름   | 역할           | 이름   | 역할      |
| ------ | -------------- | ------ | --------- |
| [김유진](https://github.com/zladb) | Backend, OCR   | [권가영](https://github.com/gayeong718) | Frontend |
| [김휘동](https://github.com/HwiDong6831) | Backend, Infra | [서유민](https://github.com/sennaseo) | Frontend |
| [정나금](https://github.com/gomie1) | Backend, DB    | [신은찬](https://github.com/eunchan0324) | Frontend |

