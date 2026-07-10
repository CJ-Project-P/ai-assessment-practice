# AI 역량검사 전략게임 연습

AI 역량검사에 나오는 전략게임 유형(도형 회전, 순서 기억, 정보 회상, 규칙 추론)을 **학습 모드**로 규칙부터 익히고, **실전 분량 모드**로 실제 검사와 유사한 문제 수·제한시간 아래 연습하는 웹 서비스예요. 게임이 끝나면 총점이 아니라 **문항별로 어디서 틀렸는지**를 바로 확인할 수 있어요.

## 주요 기능

- **전략게임 5종**: 도형 회전하기 · 마법약 만들기 · 도형 순서 기억하기 · 음식 기억하기 · 버스 번호 기억하기
- **학습 모드**: 문제 개수를 직접 정해서 연습, 문제 풀 때마다 바로 정답/오답 확인
- **실전 분량 모드**: 실제 검사와 비슷한 고정 문제 수 + 제한시간, 세트를 다 풀어야 결과 공개
- **도형 회전 시뮬레이터**: 4×4 격자에서 회전·반전 버튼을 직접 눌러보며 원리를 이해하는 보조 도구
- **틀린 문제 모아보기**: 게임별로 필터링해서 놓쳤던 문제를 다시 확인
- **내 실전 기록**: 실전 분량 모드 정확도 추이를 게임별 그래프로 확인
- **회원가입 / 로그인**: Supabase Auth 기반 이메일 인증, 기록은 로그인한 계정별로 저장

## 사용자 흐름

```
홈
 │  서비스 소개 + 게임 목록
 ▼
게임 선택
 │  도형 회전하기 / 마법약 만들기 / 도형 순서 기억하기 / 음식 기억하기 / 버스 번호 기억하기
 ▼
모드 선택
 │
 ├─▶ 학습 모드 ────┐
 │                │
 └─▶ 실전 분량 모드 ─┤
                  ▼
               결과 화면 (문항별 정답·오답 확인)
                  │
                  ├─▶ 같은 게임 재도전
                  └─▶ 다른 게임 선택
```

- **학습 모드**는 문제를 풀 때마다 그 자리에서 정답/오답을 알려줘서 판단을 바로 교정할 수 있어요.
- **실전 분량 모드**는 세트를 다 풀기 전까지 정답을 알려주지 않아서, 실제 검사의 시간 압박과 판단력을 그대로 연습해요.
- 결과 화면에서는 틀린 문제만 따로 모아서 볼 수 있고, 로그인했다면 이 기록이 계정에 남아서 "내 실전 기록" 페이지에서 정확도 추이로 확인할 수 있어요.

## 화면 소개
너무 많아서 많이 스킵했습니다.

### 홈

<img width="2544" height="1435" alt="image" src="https://github.com/user-attachments/assets/4b9594ce-9de6-4809-805e-2a0758bdf23c" />


### 게임 선택

<img width="2539" height="1449" alt="image" src="https://github.com/user-attachments/assets/3edfcc3e-e1d4-40b3-8a4d-e7cf46d6a682" />


### 도형 회전하기
<img width="2544" height="1390" alt="image" src="https://github.com/user-attachments/assets/74250e01-fd25-4982-9937-ba3b3a898b64" />

#### 도형 회전하기 - 학습 모드
<img width="2536" height="1435" alt="image" src="https://github.com/user-attachments/assets/6a3fbceb-6914-4637-9611-0ee414e2f486" />
<img width="2526" height="1402" alt="image" src="https://github.com/user-attachments/assets/4b1ff78a-e1f6-4698-83c5-48ca50f40af8" />
<img width="2544" height="1429" alt="image" src="https://github.com/user-attachments/assets/bba188b0-94bd-4b64-979a-43ee2f28696f" />
<img width="2533" height="1435" alt="image" src="https://github.com/user-attachments/assets/969af0f8-3cba-496b-abd0-3a6915895438" />


#### 도형 회전하기 - 실습 모드
실제 검사와 똑같 문제 수 + 제한시간으로 연속해서 풀어요.
<img width="1267" height="702" alt="image" src="https://github.com/user-attachments/assets/7d9b17a2-fec7-4fa6-b3ed-ae944cf226b3" />


#### 도형 회전하기 - 도형 회전 시뮬레이터
<img width="2545" height="1426" alt="image" src="https://github.com/user-attachments/assets/738ebf56-96ab-4e3a-a5a8-523bcb3383cc" />
<img width="1269" height="712" alt="image" src="https://github.com/user-attachments/assets/95d6f30f-0c74-4b36-93c6-8b41546aaa77" />

### 마법약 만들기
<img width="1268" height="710" alt="image" src="https://github.com/user-attachments/assets/8a6bf025-6209-4c2a-bff8-d5479a89897b" />

#### 마법약 만들기 - 학습 모드, 실습모드
<img width="1270" height="649" alt="image" src="https://github.com/user-attachments/assets/72f9a37e-53a9-4885-a393-2af09cf08477" />
<img width="1267" height="649" alt="image" src="https://github.com/user-attachments/assets/7acc6a75-b343-4e3a-a0f7-e94f6da1de4e" />
<img width="1267" height="685" alt="image" src="https://github.com/user-attachments/assets/4dac340d-8b95-455a-b2eb-92c2d56917ee" />

### 도형 순서 기억하기 - 학습 모드, 실습모드
<img width="1264" height="698" alt="image" src="https://github.com/user-attachments/assets/6e8f1d62-037c-4e6c-9dc7-34491fe92371" />
<img width="1265" height="667" alt="image" src="https://github.com/user-attachments/assets/d9184e04-52c3-4d15-a164-7cdbcefaee69" />
<img width="1267" height="703" alt="image" src="https://github.com/user-attachments/assets/6258caeb-c1ad-491c-8652-f2e8634c47ad" />
<img width="1268" height="560" alt="image" src="https://github.com/user-attachments/assets/94b059fb-bc50-436d-ace2-b127b1e824dd" />

### 음식 순서 기억하기 - 학습 모드, 실습모드
<img width="1256" height="690" alt="image" src="https://github.com/user-attachments/assets/77be7a80-59d6-4c1e-a413-8f1fd355ead0" />

### 버스 순서 기억하기 - 학습 모드, 실습모드
<img width="1269" height="638" alt="image" src="https://github.com/user-attachments/assets/6079cc6b-4358-44c0-ae2e-de3557e9e8d6" />
<img width="1262" height="679" alt="image" src="https://github.com/user-attachments/assets/d8e281d0-1d98-4be3-abef-10fc1b4b0fc8" />


### 틀린 문제 모아보기
<img width="1271" height="729" alt="image" src="https://github.com/user-attachments/assets/31abb8f6-3ae8-48ec-bbf7-afb7bd4c78e3" />


## 게임 규칙 요약

| 게임 | 판단 유형 | 전용 보조 도구 |
|---|---|---|
| 도형 회전하기 | Before → After 도형이 되도록 회전·반전 조작 시퀀스를 직접 구성 | 도형 회전 시뮬레이터 |
| 마법약 만들기 | 공개되지 않은 재료 조합 규칙을 추론 (중간에 규칙이 바뀔 수 있음) | 없음 |
| 도형 순서 기억하기 | 현재 도형이 2개 전/3개 전 도형과 같은지 판단 (N-back) | 없음 |
| 음식 기억하기 | 여러 턴에 걸쳐 본 메뉴 중 반복 등장한 메뉴 찾기 | 없음 |
| 버스 번호 기억하기 | 여러 턴에 걸쳐 본 번호 중 한 번도 등장하지 않은 번호 찾기 | 없음 |

더 자세한 화면 구성과 콘텐츠 정의는 [`docs/user-flow.md`](docs/user-flow.md) 참고.

## 기술 스택

- **Frontend**: React + Vite + TypeScript + Tailwind CSS, React Router
- **Backend**: FastAPI (Python)
- **Database & Auth**: Supabase (Postgres + Auth)

프론트엔드가 Supabase에 직접 붙지 않고, FastAPI가 Supabase 세션 토큰을 검증한 뒤 시크릿 키로 Postgres에 접근해요. 이 경로는 Supabase RLS를 우회하기 때문에, "이 기록이 진짜 이 유저 것인지"는 FastAPI 코드가 매 요청마다 직접 검사해요.

## 프로젝트 구조

```
frontend/   React + Vite + TypeScript 프론트엔드
backend/    FastAPI 백엔드 (실전 기록 · 틀린 문제 API)
docs/       기획 문서 (user-flow 등)
design/     화면 디자인 레퍼런스
```

## 개발 환경 실행

### Frontend

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`이 필요해요.

### Backend

```bash
cd backend
py -3 -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python -m uvicorn app.main:app --reload
```

`backend/.env`에 `SUPABASE_URL`, `SUPABASE_SECRET_KEY`가 필요해요. `GET /health`로 동작 확인.
