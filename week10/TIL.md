# 📘 Today I Learned — Week 10

### 1. 오늘 배운 내용

- 9주차까지 완성한 앱은 `yarn dev`와 `localhost`에서만 동작했다. **Vercel**에 배포하면 `https://[프로젝트명].vercel.app` 형태의 공개 URL로 어디서든 접속할 수 있다.
- Vercel은 Vite 프로젝트를 자동 감지해 **기본 프레임워크 설정**으로 빌드·배포한다. 별도 `vercel.json` 없이 배포하려면 `HashRouter`를 사용해 클라이언트 라우팅을 처리한다 (`/#/login`, `/#/lions/:id`).
- `.env.local`의 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`는 Vercel 대시보드 **Environment Variables**에 동일한 이름으로 등록해야 한다. 코드에 키를 하드코딩하면 안 된다.
- Supabase Authentication의 **Site URL / Redirect URLs**에 Vercel 배포 도메인을 추가해야 로그인·회원가입 리다이렉트가 프로덕션에서도 동작한다.
- GitHub 저장소를 Vercel에 연결하면 `main` 브랜치 push 시 **자동 재배포(CD)** 가 실행된다. 모노레포(`week10` 하위 폴더)는 Vercel 프로젝트 설정에서 Root Directory를 `week10`으로 지정한다.
- 배포 전 `yarn build` → `yarn preview`로 프로덕션 번들을 로컬에서 검증했다. `console.error` 제거, 미사용 파일(`data/lions.ts`, `DetailSection.tsx`) 정리, TypeScript 빌드 통과를 확인했다.
- Realtime WebSocket 구독은 과제 범위 밖이라 제거해 콘솔 에러를 없앴고, 동료 피드백으로 검색·필터 결과 개수 표시와 카드 **상세 보기** 안내를 추가했다.

### 2. 핵심 정리 (내 언어로)

- 개발 완료와 **서비스 완료**는 다르다. 빌드가 되고, 환경 변수가 맞고, 라우팅이 서버에서도 통하고, 인증 URL이 맞아야 진짜 배포가 끝난다.
- SPA 배포에서 서버 설정 없이 라우팅을 맞추려면 `BrowserRouter` 대신 `HashRouter`를 쓰면 직접 URL 입력·새로고침이 동작한다.
- anon key는 공개되어도 되지만 **환경 변수로 분리**하는 습관은 로컬·스테이징·프로덕션 설정을 바꿀 때 필수다.
- 동료 피드백은 "카드가 클릭 가능한지 모르겠다"처럼 작은 UX 이슈에서도 서비스 품질을 크게 바꿀 수 있다.

### 3. 배포 정보

- **배포 URL:** https://week10-ochre.vercel.app
- **GitHub 저장소:** https://github.com/MONG-SIL/like_lion_TIL_repo
- **Root Directory:** `week10`


### 4. 프로덕션 점검 체크리스트

- [x] `yarn build` 성공
- [x] `yarn preview`에서 `/`, `/#/login`, `/#/lions/:id` 응답 확인
- [x] `console.log` / 불필요한 `console.error` 제거
- [x] 미사용 import·컴포넌트·데이터 파일 정리
- [x] Vercel Vite 기본 설정 + `HashRouter`로 배포 (별도 `vercel.json` 없음)
- [x] Vercel 환경 변수 설정
- [ ] Supabase Redirect URL 등록 (`https://week10-ochre.vercel.app`)
- [ ] 배포 URL에서 CRUD·로그인 동작 확인
- [x] 동료 피드백 작성 및 1건 이상 반영 (`FEEDBACK.md`)

### 5. 느낀 점

- 로컬에서 잘 되던 앱도 배포하면 환경 변수·라우팅·인증 URL 때문에 한 번 더 막히는 경우가 많다. 배포는 "마지막 통합 테스트"라고 생각하면 된다.
- 피드백을 반영해 카드 hover와 모바일 레이아웃을 손보니, 코드만 볼 때보다 실제 사용자 관점이 훨씬 분명해졌다.
