# lion-track-week10

Vite + React + TypeScript + Supabase 기반 아기 사자 명단 대시보드.

## 로컬 실행

```bash
yarn install
cp .env.example .env.local   # Supabase 값 입력
yarn dev
```

`http://localhost:5173` 에서 확인합니다.

## 프로덕션 빌드

```bash
yarn build
yarn preview
```

## Vercel 배포

1. GitHub 저장소의 **Root Directory**를 `week10`으로 설정합니다.
2. Vercel 환경 변수에 아래 값을 등록합니다.
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Supabase 대시보드 → Authentication → URL Configuration에 배포 URL을 Site URL / Redirect URLs에 추가합니다.
4. `main` 브랜치에 push하면 자동 배포됩니다.

## 학습 노트

Week 10 배포·프로덕션 점검 내용은 **[TIL.md](./TIL.md)** 를 참고하세요.
