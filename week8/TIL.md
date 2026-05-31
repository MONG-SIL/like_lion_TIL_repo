# Today I Learned — Week 8

7주차 JavaScript React 프로젝트에 TypeScript를 적용해, 타입 안정성을 확보한 아기 사자 대시보드 정리.

## 1. 오늘 배운 내용

### JavaScript에서 발생하는 타입 관련 런타임 오류

JavaScript는 변수·함수 인자·객체 속성에 어떤 타입이 들어와도 실행 전까지 막지 않는다. 화면이 잘 나오면 문제없어 보이지만, 잘못된 값이 전달되면 실행 중에 터진다.

| 오류 유형 | 예시 상황 | 런타임 메시지 |
|-----------|-----------|---------------|
| undefined 접근 | API 응답 구조를 잘못 가정하고 `user.name.first` 호출 | `Cannot read properties of undefined` |
| 잘못된 함수 호출 | props로 함수 대신 다른 값을 넘김 | `undefined is not a function` |
| 배열/객체 혼동 | 배열을 기대했는데 `undefined`를 `.map()` | `Cannot read properties of undefined (reading 'map')` |
| 오타·누락 속성 | `lion.nmae`처럼 존재하지 않는 필드 참조 | `undefined`가 화면에 표시되거나 조건 분기 오류 |

7주차 `randomUserApi.js`는 `res.json()` 결과를 그대로 쓰고, `lionFromApiUser(user)`는 `user?.name?.first`처럼 옵셔널 체이닝으로 방어했다. 그래도 함수 시그니처·props·상태에는 타입 정보가 없어, 컴파일 시점에 잡을 수 있는 실수는 여전히 남는다.

TypeScript는 이런 문제를 코드를 실행하기 전, 편집기와 `tsc` 단계에서 알려준다.

### TypeScript 기본 타입을 변수와 함수에 적용하기

프로젝트 전반에서 기본 타입과 배열·객체 타입을 함수 매개변수와 반환값에 명시했다.

```typescript
// utils/lionUtils.ts
export function normalizeText(text: unknown): string {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

export function parseSkills(skillsText: string): string[] { ... }

export function getVisibleLions(lions: Lion[], options: ViewOptions): Lion[] { ... }
```

- `string`, `boolean`, `number` — 폼 필드, 플래그, `createdAt` 타임스탬프
- `string[]` — `skills`, 필터링된 명단
- `Lion[]` — 명단 상태, API 변환 결과
- `unknown` — API·외부 입력처럼 형태를 모를 때 받고, 내부에서 `String()` 등으로 좁힘

함수에 반환 타입을 적어 두면, 실수로 다른 타입을 return해도 바로 오류가 난다.

### interface와 type으로 복잡한 데이터 구조 정의하기

아기 사자 데이터는 중첩 객체(`contacts`)와 배열(`skills`)을 포함한다. 이를 `src/types/lion.ts`에 모아 정의했다.

```typescript
export interface LionContactRow {
  label: string;
  value: string;
  href?: string;          // 선택 속성
}

export interface Lion {
  id: string;
  isSelf: boolean;
  name: string;
  part: LionPart;
  skills: string[];
  contacts: LionContactRow[];
  createdAt: number;
  // ...
}

export type LionPart = 'Frontend' | 'Backend' | 'Design';
export type PartFilter = 'all' | LionPart;
```

- interface — 객체 형태(`Lion`, `ViewOptions`, `LionFormFields`)에 사용
- type — 유니온(`LionPart`, `SortBy`), `Omit` 조합(`LionSeed = Omit<Lion, 'createdAt'>`)에 사용
- 중첩 타입 분리 — `RandomUserName`, `RandomUserPicture` 등 API 응답 하위 구조도 별도 정의

초기 mock 데이터(`lions.ts`)는 `createdAt`이 없으므로 `LionSeed[]`로, `prepareInitialLions` 이후에는 `Lion[]`로 구분했다. 같은 개념이라도 생명주기에 따라 타입을 나누면 변환 지점이 명확해진다.

### React 컴포넌트 props에 타입 지정하기

모든 컴포넌트에 props interface를 두었다. 잘못된 props를 넘기면 편집기에서 즉시 오류가 표시된다.

```typescript
// components/LionSummaryCard.tsx
interface LionSummaryCardProps {
  lion: Lion;
}

export default function LionSummaryCard({ lion }: LionSummaryCardProps) { ... }
```

```typescript
// pages/ListPage.tsx
interface ListPageProps {
  lions: Lion[];
  canDeleteLast: boolean;
  deleteLastLion: () => void;
  addLions: (lions: Lion[]) => void;
  fetchBag: UseRandomUserFetchReturn;
}
```

Hook 반환값도 `UseAddFormReturn`, `UseRandomUserFetchReturn`처럼 interface로 정의해, `ControlsSection`의 `form` prop 타입과 연결했다. props 계약이 코드에 문서화되므로, 어떤 값을 넘겨야 하는지 파일만 열어도 파악할 수 있다.

### useState 제네릭으로 상태 타입 명시하기

7주차 JavaScript는 `useState([])`처럼 초기값만으로 타입을 추론했다. TypeScript에서는 제네릭으로 의도를 분명히 한다.

```typescript
// hooks/useLions.ts
const [lions, setLions] = useState<Lion[]>(() => prepareInitialLions(initialLions));

// hooks/useAddForm.ts
const [isOpen, setIsOpen] = useState<boolean>(false);
const [form, setForm] = useState<LionFormFields>(EMPTY_FORM);
const [errors, setErrors] = useState<FormErrors>({});

// hooks/useRandomUserFetch.ts
const [lastRequest, setLastRequest] = useState<FetchTask | null>(null);
```

| 상태 | 타입 | 이유 |
|------|------|------|
| `lions` | `Lion[]` | 명단 배열, 요소 구조 고정 |
| `form` | `LionFormFields` | 폼 필드 키·값 형태 고정 |
| `errors` | `FormErrors` | 필드별 에러 메시지 |
| `lastRequest` | `FetchTask \| null` | 재시도할 비동기 함수 또는 없음 |

초기값이 `[]`이면 TypeScript는 `never[]`로 추론할 수 있어, 배열 상태에는 제네릭이 특히 중요하다.

### 이벤트 핸들러의 이벤트 객체 타입 지정하기

DOM 이벤트마다 `target`의 타입이 다르다. `e.target.value`에 바로 접근하려면 이벤트 타입을 맞춰야 한다.

```typescript
// hooks/useAddForm.ts
function handleSubmit(event: FormEvent<HTMLFormElement>): void {
  event.preventDefault();
  // ...
}

// components/ControlsSection.tsx
function handlePartFilterChange(e: ChangeEvent<HTMLSelectElement>): void {
  onPartFilterChange(e.target.value as PartFilter);
}

function handleSearchNameChange(e: ChangeEvent<HTMLInputElement>): void {
  onSearchNameChange(e.target.value);
}
```

| 이벤트 | 타입 | 사용 위치 |
|--------|------|-----------|
| `onSubmit` | `FormEvent<HTMLFormElement>` | 추가 폼 제출 |
| `onChange` (select) | `ChangeEvent<HTMLSelectElement>` | 파트 필터, 정렬 |
| `onChange` (input) | `ChangeEvent<HTMLInputElement>` | 이름 검색, 폼 입력 |
| `keydown` (document) | `Event` + `instanceof KeyboardEvent` | Esc로 폼 닫기 |

`select`의 `value`는 `string`이므로 `PartFilter`, `SortBy`처럼 좁은 타입이 필요할 때는 유효값 검증 후 사용한다.

### 타입 정의를 별도 파일로 분리해 재사용하기

공통 타입은 `src/types/lion.ts` 한곳에 모았다.

```
src/types/lion.ts          ← Lion, ViewOptions, RandomUserResponse 등
    ↓ import
data/lions.ts              ← LionSeed[]
utils/lionUtils.ts         ← Lion, ValidationResult
hooks/useLions.ts          ← Lion, LionSeed
components/*.tsx           ← Lion, props interface
pages/*.tsx                ← Lion, DetailLocationState
```

한 파일에서 정의 → 여러 모듈에서 import 구조의 장점:

- 데이터 구조 변경 시 수정 지점이 한곳으로 모임
- 컴포넌트·훅·유틸이 같은 `Lion` 타입을 공유해 불일치 방지
- API 응답(`RandomUserResponse`)과 도메인 모델(`Lion`)의 경계가 분명해짐

CSS import는 `src/vite-env.d.ts`의 `/// <reference types="vite/client" />`로 처리했다. 스타일 파일은 `.css` 그대로 두고, TypeScript는 타입 선언만 추가했다.

### JavaScript → TypeScript 마이그레이션 흐름

기능 변경 없이 확장자와 타입만 추가하는 순서로 진행했다.

```
1. tsconfig.json (strict: true), vite.config.ts, package.json 설정
2. src/types/lion.ts — 도메인·API 타입 정의
3. .js → .ts (data, utils, hooks)
4. .jsx → .tsx (components, pages, App, main)
5. yarn build (tsc -b && vite build)로 타입 검사 통과 확인
```

7주차와 동일하게 동작해야 한다 — 라우팅, URL 쿼리, 명단 추가/삭제, RandomUser API, 폼 검증 모두 그대로 유지하고 타입 레이어만 얹었다.

## 2. 핵심 정리 (내 언어로)

* JavaScript 타입 오류는 실행 전에 잡히지 않고, 잘못된 props·API 구조·undefined 접근에서 런타임에 터진다.
* `interface`/`type`으로 데이터 형태를 코드에 적어 두면, 의도가 문서화되고 편집기가 실수를 미리 알려준다.
* 컴포넌트 props, `useState<T>`, 이벤트 핸들러(`ChangeEvent`, `FormEvent` 등)에 타입을 지정하면 작성 시점에 오류를 발견할 수 있다.
* 공통 타입은 `src/types/`에 분리해 data·utils·hooks·components가 같은 계약을 공유한다.
* TypeScript는 처음엔 번거롭지만, 리팩토링·협업·자동 완성에서 코드 의도가 명확해지는 효과가 있다.

## 3. 결과 이미지(스크린샷)

1. 2026-05-31 12:43:16 목록 페이지 초기 화면 (localhost:5173, 총 4명)
![결과 이미지](<스크린샷 2026-05-31 오후 12.43.16.png>)

2. 2026-05-31 12:43:32 상세 페이지 (/lions/lion-chj, 최정환 프로필)
![결과 이미지](<스크린샷 2026-05-31 오후 12.43.32.png>)

3. 2026-05-31 12:43:58 URL 검색 연동 (?search=brew, 1명 필터링)
![결과 이미지](<스크린샷 2026-05-31 오후 12.43.58.png>)

4. 2026-05-31 12:44:10 URL 정렬·검색 동시 적용 (?sort=name&search=brew)
![결과 이미지](<스크린샷 2026-05-31 오후 12.44.10.png>)

5. 2026-05-31 12:44:23 URL 정렬 적용 (?sort=name, 9명 이름순)
![결과 이미지](<스크린샷 2026-05-31 오후 12.44.23.png>)


## 4. 느낀 점

* 7주차까지는 "돌아가면 OK"였는데, TypeScript를 쓰니 함수에 뭘 넘겨야 하는지 코드가 스스로 설명하는 느낌이 들었다.
* 처음에는 interface 작성이 손이 많이 가지만, props 자동 완성과 오타 즉시 발견 덕분에 디버깅 시간이 줄어드는 쪽으로 균형이 맞는 것 같다.
* 타입을 `src/types/`에 모아 두니, 7주차에 흩어져 있던 "이 객체에 뭐가 들어있지?"라는 의문이 한 파일에서 해소됐다.
* 기능은 그대로 두고 타입만 추가하는 마이그레이션을 해보니, 실무에서 JS → TS 전환이 어떤 순서로 이루어지는지 감이 잡혔다.
