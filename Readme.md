# ExtFilter - 파일 확장자 차단 시스템

## 프로젝트 구조
- Backend: 스프링 부트 백엔드
- Backend/src/main/frontend: React 프론트엔드

## 기술 스택
### Backend
- Spring Boot 3.2.3
- Spring Security
- Spring Data JPA
- MySQL
- Gradle

### Frontend
- React
- Material-UI
- Axios
- React Router DOM

## 시작하기

### 사전 요구사항
- Java 17
- Node.js 18 이상
- MySQL 8.0
- PM2 (프로세스 매니저)
- Git

#### PM2 설치
```bash
npm install -g pm2
```

### 데이터베이스 설정

#### 1. MySQL 데이터베이스 생성
```sql
CREATE DATABASE extfilter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2. 데이터베이스 구조
```
extfilter 데이터베이스
├── fixed_extensions (고정 확장자)
│   ├── id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
│   ├── name (VARCHAR(20), UNIQUE, NOT NULL) - 확장자명
│   ├── is_blocked (BOOLEAN, NOT NULL) - 차단 여부
│   ├── created_at (DATETIME, NOT NULL) - 생성일시
│   └── updated_at (DATETIME, NOT NULL) - 수정일시
│
└── custom_extensions (커스텀 확장자)
    ├── id (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
    ├── name (VARCHAR(20), UNIQUE, NOT NULL) - 확장자명
    └── created_at (DATETIME, NOT NULL) - 생성일시
```

#### 3. application.yml 설정 (application-aws.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/extfilter
    username: your_username
    password: your_password
```

### Backend 실행

#### PM2를 이용한 서버 실행 (권장)
```bash
cd Backend
./gradlew build  # JAR 파일 빌드
pm2 start server.json  # PM2로 서버 실행
pm2 list  # 실행 상태 확인
pm2 stop server  # 서버 중지
pm2 restart server  # 서버 재시작
```

#### 개발 모드 실행
```bash
cd Backend
./gradlew bootRun
```

- 서버 실행 후 접속: http://localhost:8080

### Frontend 실행
```bash
cd frontend
npm install
npm start
```
- 개발 서버 실행 후 접속: http://localhost:3000

## 주요 기능

### 1. 고정 확장자 관리
- 기본 제공되는 위험 확장자 목록 관리
- 체크박스로 차단 여부 설정
- 설정 상태 DB 저장 및 유지

### 2. 커스텀 확장자 관리
- 사용자 정의 확장자 추가/삭제
- 최대 200개 확장자 등록 가능
- 중복 확장자 체크
- 최대 20자 입력 제한

### 3. 업로드 가능 확인 기능 (추가 기능)
- 파일을 등록하여, 업로드 가능/불가능 확인
- 여러 개의 파일을 한꺼번에 확인 가능