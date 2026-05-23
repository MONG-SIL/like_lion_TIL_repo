# Today I Learned — Week 7

React Router로 목록/상세 페이지를 나누고, URL과 화면 상태를 연동한 아기 사자 대시보드 정리.

## 1. 오늘 배운 내용

### SPA에서 URL이 바뀌어도 페이지 전체가 새로 로드되지 않는 이유

전통적인 멀티 페이지 웹사이트(MPA)에서는 링크를 누르면 브라우저가 새 HTML 문서를 서버에 요청하고, 받은 문서로 화면 전체를 다시 그린다. 이때 JavaScript 상태, 스크롤 위치, 입력 중이던 값은 모두 사라진다.

SPA(Single Page Application)는 처음 한 번 index.html과 JavaScript 번들을 받은 뒤, 이후 주소 변경은 브라우저 History API로 처리한다. React Router의 BrowserRouter가 URL 변화를 감지하면, 같은 React 앱 안에서 어떤 Route를 보여줄지만 바꾼다.

```
[사용자] 요약 카드 클릭
    → URL: / → /lions/lion-chj (주소창만 변경)
    → React: <ListPage /> 대신 <DetailPage /> 렌더
    → HTML 문서 자체는 다시 요청하지 않음
```

그래서 명단 데이터(lions)처럼 App에 올려 둔 상태는 페이지를 이동해도 유지된다. 6주차까지는 URL이 바뀌지 않아 한 화면처럼 느꼈고, 7주차부터는 URL이 바뀌지만 앱은 하나라는 점이 SPA의 핵심이다.

### 한 화면에 모든 정보 vs 목록/상세 페이지 분리

| 구분 | 6주차 (한 화면) | 7주차 (페이지 분리) |
|------|----------------|---------------------|
| 구조 | 컨트롤 + 요약 카드 + 상세 카드 전체 목록 | 목록(/) / 상세(/lions/:id) |
| 정보 찾기 | 스크롤이 길어질수록 원하는 사람 찾기 어려움 | 요약만 보고, 필요할 때만 상세로 이동 |
| URL | 항상 / | 목록·상세·필터마다 다른 주소 |
| 공유 | 이 사람 상세를 URL로 가리키기 어려움 | /lions/lion-chj 링크로 바로 공유 가능 |

6주차 App.jsx는 SummarySection과 DetailSection을 한 main 안에 나란히 두었다. 인원이 늘면 상세 카드가 아래로 길게 쌓여 요약의 의미가 약해진다.

7주차는 ListPage에는 요약 그리드만, DetailPage에는 선택한 한 명의 LionDetailCard만 둔다. 사용자 입장에서는 명단 훑기 → 관심 있는 사람만 깊게 보기 흐름이 분명해진다.

### URL 경로 파라미터로 특정 데이터를 식별하는 흐름

경로에 :id를 두면 지금 어떤 아기 사자를 보여줄지를 URL이 담는다.

```
/lions/lion-chj
         └─ 동적 세그먼트 :id → "lion-chj"
```

프로젝트에서의 흐름:

1. 이동 — LionSummaryCard의 Link가 to={`/lions/${lion.id}`}로 이동한다.
2. 라우트 매칭 — App.jsx의 Route path="/lions/:id" element={<DetailPage />} 가 선택된다.
3. id 읽기 — DetailPage에서 useParams()로 id를 꺼낸다.
4. 데이터 찾기 — lions.find((item) => item.id === id)로 해당 객체를 찾는다.
5. 화면 표시 — 있으면 LionDetailCard, 없으면 찾을 수 없습니다 메시지.

```jsx
// DetailPage.jsx 요약
const { id } = useParams();
const lion = lions.find((item) => item.id === id);
```

id는 화면에 그릴 데이터의 키이고, 실제 데이터는 부모에서 내려준 lions 배열에 있다. URL만으로 서버에 다시 물어보지 않고, 이미 메모리에 있는 명단에서 찾는다.

### 보기 옵션을 URL 쿼리와 연동할 때의 장점

6주차 useViewOptions는 useState로 필터·정렬·검색을 관리했다. 화면에서는 잘 동작하지만 새로고침하면 옵션이 초기화되고, Frontend만 본 목록을 URL로 넘기기 어렵다.

7주차는 useSearchParams로 주소가 곧 보기 옵션이 되게 했다.

| 예시 URL | 의미 |
|----------|------|
| / | 전체, 최신추가순, 검색 없음 (기본값 → 쿼리 생략) |
| /?part=Frontend | Frontend 파트만 |
| /?sort=name&search=홍 | 이름순 + 홍 검색 |

옵션을 바꿀 때 setSearchParams로 URL을 갱신하고, 처음 들어올 때는 searchParams.get('part') 등으로 읽는다. 기본값(all, latest, 빈 검색)은 buildSearchParams에서 URL에 넣지 않는다.

컴포넌트 내부 상태만 쓸 때

- 새로고침·북마크·링크 공유 시 필터가 사라짐
- 이 조건의 목록을 동료에게 보내기 어려움
- 브라우저 뒤로 가기와 보기 옵션 history가 어긋날 수 있음

URL 쿼리와 연동할 때

- 주소만 복사해도 같은 필터/정렬/검색 화면 재현
- 새로고침해도 useSearchParams가 URL에서 다시 읽음
- 사용자에게 익숙한 주소 = 화면 상태 모델

보기 옵션은 목록 페이지에서만 쓰이므로 useViewOptions는 ListPage 안에 두었고, 상세 페이지 URL(/lions/:id)과는 분리했다.

### 여러 페이지가 같은 데이터를 공유할 때 — 상태를 어디에 둘까

ListPage와 DetailPage는 둘 다 lions가 필요하다. 목록에서 추가한 사람을 상세에서 바로 보려면 같은 상태 인스턴스를 써야 한다.

기준: 이 데이터를 쓰는 컴포넌트들의 공통 조상에 둔다.

```
App (useLions → lions)
 ├── ListPage   … 목록·추가·삭제·필터
 └── DetailPage … id로 한 명 조회
```

- useLions를 ListPage에만 두면 → 상세로 가면 다른 lions가 되거나 props로 넘기기 어렵다.
- useLions를 App에 두고 → lions, addLions 등을 props로 내려주면 → 두 페이지가 한 명단을 공유한다.

반대로 한 페이지에서만 쓰는 상태는 그 페이지(또는 그 Hook)에 둔다.

| 상태 | 위치 | 이유 |
|------|------|------|
| lions 명단 | App | 목록·상세 공통 |
| 필터/정렬/검색 | ListPage + useViewOptions | 목록 전용, URL은 / 쿼리 |
| 추가 폼 | ListPage + useAddForm | 목록에만 폼 UI |
| API 로딩/재시도 | App + useRandomUserFetch | 명단 변경은 어디서든 일어날 수 있음 |

useContext 없이도 필요한 만큼만 위로 올리기만으로 공유 문제를 해결할 수 있다는 점이 이번 주의 실습 포인트였다.

## 2. 핵심 정리 (내 언어로)

* SPA는 문서를 다시 받지 않고 React가 라우트에 맞는 컴포넌트만 바꾼다.
* 목록/상세 분리는 스크롤 부담을 줄이고, URL로 누구를 보는지를 표현한다.
* /lions/:id의 id → useParams → find로 표시할 한 명을 고른다.
* 필터/정렬/검색을 URL 쿼리에 두면 공유·새로고침·북마크에 유리하다.
* 여러 페이지가 쓰는 데이터는 공통 부모(App)에 두고, 페이지 전용 상태는 해당 페이지에 둔다.

## 3. 결과 이미지(스크린샷)

1. 2026-05-23 23:53:33 목록 페이지 초기 화면 (localhost:5173, 총 9명)
![결과 이미지](<스크린샷 2026-05-23 오후 11.53.33.png>)

2. 2026-05-23 23:53:49 상세 페이지 (/lions/lion-chj, 최정환 프로필)
![결과 이미지](<스크린샷 2026-05-23 오후 11.53.49.png>)

3. 2026-05-23 23:54:43 URL 검색 연동 (?search=la, 3명 필터링)
![결과 이미지](<스크린샷 2026-05-23 오후 11.54.43.png>)

4. 2026-05-23 23:55:00 URL 필터·정렬·검색 동시 적용 (?part=Frontend&sort=name&search=la)
![결과 이미지](<스크린샷 2026-05-23 오후 11.55.00.png>)

5. 2026-05-23 23:55:50 URL 필터·정렬 적용 (?part=Frontend&sort=name, Frontend 8명 이름순)
![결과 이미지](<스크린샷 2026-05-23 오후 11.55.50.png>)


## 4. 느낀 점

* URL이 바뀌는데 화면이 부드럽게 바뀌는 건, 예전 MPA의 페이지 이동과 다르게 앱이 살아 있는 채로 화면만 갈아끼우는 것이라는 걸 체감했다.
* 6주차 한 화면 구조와 비교하니, 정보 밀도와 주소 설계를 같이 고민해야 한다는 게 보였다.
* 상태 위치는 전역으로 다 올릴지가 아니라 누가 그 데이터를 쓰는지로 결정하면 된다.
