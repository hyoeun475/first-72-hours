# 첫 72시간 (First 72 Hours) — 작업 지침

디지털 성범죄 피해 초기 대응을 돕는 모바일 우선 웹 앱 MVP. 요구사항 기준 문서는 상위 폴더의
`FIRST_72_HOURS_MVP_SPEC_통합본.md`이며, 안전·개인정보 원칙은 `.claude/skills/first-72-hours-agent/SKILL.md`에 있다.

## 스택
- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- Zod (폼 검증), Vitest + React Testing Library (테스트)
- 서버·DB·외부 AI API·인증 없음. 모든 상태는 브라우저 메모리. 로컬 저장은 이용자가 명시적으로 켠 경우에만.

## 명령
```
npm run dev        # 개발 서버
npm run lint
npm run typecheck
npm run test
npm run build
```

## 구조
- `src/features/agent/` 규칙 기반 에이전트(상태 흐름, 규칙, 요약 생성). 외부 LLM 호출 없음.
- `src/data/` 안내 문구, 지원기관, 삭제 요청 템플릿. 기관 정보는 공식 출처와 확인일을 함께 기록.
- `src/features/session/` 세션 상태(Context). 로컬 저장 opt-in.
- `src/app/` 화면: `/`, `/guide`, `/records`, `/summary`, `/resources`, `/safety`, `/takedown`.
- `tests/` 단위·컴포넌트 테스트.

## 하지 않을 것
- 이미지·영상·음성 업로드 UI, URL 자동 방문·크롤링
- 신고·삭제 요청 자동 제출, 계정 연동
- 사건 원문을 외부로 전송하는 코드, 민감정보 로깅
- "반드시", "72시간 안에 하지 않으면 늦는다" 류의 압박 문구, 피해자 비난 표현
- 지원기관 연락처를 기억이나 추정으로 추가하는 것 (공식 출처 확인 후에만)
