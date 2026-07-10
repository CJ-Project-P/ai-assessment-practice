# CLAUDE.md

## 프로젝트
- 모노레포: `frontend/` (React + Vite + TypeScript + Tailwind), `backend/` (FastAPI)
- 프론트 작업 시 `skills/frontend/SKILL.md` 절대 규칙 준수 (디자인 토큰만 사용, 사용자 노출 텍스트는 `@/i18n`의 `ko` 객체로만, PII 콘솔 로그 금지)
- 패키지 매니저: frontend는 npm, backend는 `py -3 -m venv .venv` + pip

## 규칙
- 수정 전 관련 파일을 먼저 읽는다
- 커밋은 사용자 승인 후에만 진행한다
- 커밋 메시지는 `type: 설명#이슈번호` 형식 (예: `chore: 프론트 초기 세팅#1`)
- git commit에 attribution/co-author 문구를 추가하지 않는다 (`~/.claude/settings.json`의 `attribution`으로 이중 적용됨)

## 금지
- `.env`, `.venv/`, `node_modules/`, `.claude/`, `.omc/` 는 커밋하지 않는다
- 확인 없이 `git push`, `git reset --hard` 등 원격/이력에 영향을 주는 명령을 실행하지 않는다

## 검증
- frontend 수정 후 `frontend/` 안에서 `npm run build` 통과 확인
- backend 수정 후 `uvicorn app.main:app --reload` 기동 + `/health` 응답 확인
