![background](https://github.com/user-attachments/assets/83bec46b-3318-4d79-9e9f-7d89dbf34aaf)

# ![24_logo](https://github.com/user-attachments/assets/0d0b7343-953f-40d1-8d80-f5e337e634e4) Twenty Four Hour
> **AI 기반 스마트 파일 스토리지 서비스**
> AI가 파일의 내용을 이해하고 지능적으로 분류하며 파일 정리를 제안하는 스마트 파일 스토리지 서비스입니다.

---

## 👨‍👩‍👧‍👦 Team Members
| 이름 | 역할 |
| :--- | :--- |
| **조유찬** | Mentor | 
| **이재호** | Project Manager / Backend | 
| **정유지** | Backend 총괄 |
| **김채윤** | Frontend 총괄 |
| **황정민** | Frontend |  
| **김강민** | Design | 

---

## 🔗 주요 참고 자료 (References)

| 구분 | 링크 |
| :--- | :--- |
|**Github**|[https://github.com/jaehoya/twenty-four-hour](https://github.com/jaehoya/twenty-four-hour)|
| **🚀 Service Link** | [http://tfh.kro.kr/login](http://tfh.kro.kr/login) |
| **📜 API 명세서** | [Swagger UI (api-docs)](http://tfh.kro.kr:4000/api-docs) |
| **🎨 Figma 디자인** | [TFH Design System](https://www.figma.com/design/N63MC6KHzNeK2tKbmaQhq5/TFH_design?node-id=0-1&t=zVf9N83OhpnsmIhO-1) |



## 🛠 Tech Stack

### **Frontend**
- **Core:** `React.js` (Vite)
- **State Management:** `Zustand` (경로 히스토리 및 모달 통합 관리)
- **Styling:** `Tailwind CSS` (반응형 디자인)
- **UI Architecture:** `React Portal` (Stacking Context 해결)
- **Networking:** `Axios` (인터셉터를 통한 JWT 관리)

### **Backend**
- **Runtime:** `Node.js` (Express)
- **Database:** `MySQL` (Sequelize ORM)
- **In-Memory:** `Redis` (작업 큐 및 메시지 브로커)
- **Task Queue:** `BullMQ` (AI 비동기 워커 구조)
- **Security:** `JWT` (Access/Refresh), `bcrypt`

### **AI & Data**
- **AI Model:** `Google Generative AI` (Gemini-1.5-flash)
- **Text Extraction:** `Mammoth` (Docx), `adm-zip`

---

## 🏗 System Architecture
본 서비스는 무거운 AI 연동 로직이 API 응답 속도를 저해하지 않도록 **Producer-Worker 패턴**을 채택했습니다.

1. **Client:** 파일 업로드 요청.
2. **API Server:** 물리 파일 저장 및 DB 메타데이터 기록 후 즉시 응답 반환.
3. **Redis/BullMQ:** AI 분석 작업을 큐(Queue)에 적재.
4. **AI Worker:** 백그라운드에서 분석 수행 후 DB 태그 정보 및 추천 경로 업데이트.

---


## 📊 데이터베이스 설계 (ERD)
<img width="1385" height="1021" alt="Untitled (2)" src="https://github.com/user-attachments/assets/881d19a5-7e4c-4713-8766-e1f0bc7c2747" />

---

## 📝 API 명세서 (Core API)

<img width="1438" height="109" alt="image" src="https://github.com/user-attachments/assets/9811d3b2-b7db-4387-bc0b-14507df24e93" />

<img width="1430" height="224" alt="image" src="https://github.com/user-attachments/assets/8ea8c06e-6469-4e33-87ba-068a04ecb91f" />

<img width="1432" height="580" alt="image" src="https://github.com/user-attachments/assets/2ddeec36-52c9-4fe5-93bd-25d6ed727117" />

<img width="1431" height="345" alt="image" src="https://github.com/user-attachments/assets/aa73ebe6-8bba-40fb-93d4-94c2d4415f91" />

<img width="1429" height="168" alt="image" src="https://github.com/user-attachments/assets/9cf4cc73-09bf-4a2b-8163-6c937ab83b0f" />

<img width="1430" height="398" alt="image" src="https://github.com/user-attachments/assets/a44c1373-f4d0-464c-8053-8e1ef70f3801" />

<img width="1429" height="226" alt="image" src="https://github.com/user-attachments/assets/8525c824-9ec3-4122-b07c-0cf4382e7e78" />

<img width="1431" height="464" alt="image" src="https://github.com/user-attachments/assets/f7de34d5-aeae-4a40-9e89-9aaeefebb160" />

<img width="1431" height="170" alt="image" src="https://github.com/user-attachments/assets/02c9b7e2-3e67-4fe3-9e8e-641c94637af1" />

---

## 📸 주요 화면 가이드 (Screenshots)
- **메인 대시보드:** 폴더 트리와 파일 목록이 시각화된 중앙 관리 화면.
이미지 삽입
- 
- **AI 추천 팝오버:** 파일 분석 후 최적의 폴더 이동을 제안하는 UI (React Portal 적용).
이미지 삽입
- **반응형 모바일:** 모바일 환경에 최적화된 하단 바 및 컨텍스트 메뉴.
이미지 삽입

## 📂 Project Structure
```
TwentyFourHour/
├── backend/
│   ├── src/
│   │   ├── services/    # 재귀 로직, AI 연동 등 핵심 서비스
│   │   ├── models/      # Sequelize 모델
│   │   └── worker/      # BullMQ AI 워커
└── frontend/
    ├── src/
    │   ├── store/       # Zustand 전역 상태
    │   ├── utils/       # 데이터 정규화(Normalization)
    │   └── pages/       # Storage, Favorite, Trash 탭
```

## ⚙️ Installation & Usage
1. Backend SetupBash
```
# 백엔드 디렉토리 이동
cd backend

# 패키지 설치
npm install

# 메인 서버 실행
npm run dev

# AI 태깅 워커 실행 (별도 터미널 권장)
npm run dev:worker
```

AI 태깅 워커 실행 (별도 터미널 권장)
npm run dev:worker

2. Frontend SetupBash
```
# 프론트엔드 디렉토리 이동
cd frontend

# 패키지 설치
npm install

# 프론트엔드 개발 서버 실행 (Vite)
npm run dev
```

