export default function ControlsSection({ count }) {
  const noop = (e) => {
    e.preventDefault();
  };

  return (
    <section
      className="controls-section page-region page-region--controls"
      aria-label="명단 조작 및 추가 폼"
    >
      <div className="controls-groups">
        <div className="controls-basic" aria-label="기본 조작">
          <button type="button" className="btn">
            아기 사자 추가
          </button>
          <button type="button" className="btn btn--danger">
            마지막 아기 사자 삭제
          </button>
          <p className="controls-bar__count" aria-live="polite">
            총 {count}명
          </p>
        </div>

        <div className="controls-fetch" aria-label="외부 데이터 불러오기">
          <div className="fetch-controls">
            <button type="button" className="btn">
              랜덤 1명 추가
            </button>
            <button type="button" className="btn">
              랜덤 5명 추가
            </button>
            <button type="button" className="btn">
              전체 새로고침
            </button>
          </div>
          <div className="request-status" aria-label="외부 요청 상태">
            <p className="request-status__text" aria-live="polite">
              준비 완료
            </p>
            <button
              type="button"
              className="btn btn--danger is-hidden"
              id="request-retry-btn"
            >
              재시도
            </button>
          </div>
        </div>
      </div>

      <div className="controls-subbar" aria-label="보기 옵션">
        <div className="view-options" aria-label="보기 옵션 입력">
          <label className="mini-field">
            <span className="mini-field__label">파트 필터</span>
            <select
              className="mini-field__input"
              id="filter-part"
              aria-label="파트 필터"
              defaultValue="all"
            >
              <option value="all">전체</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
            </select>
          </label>

          <label className="mini-field">
            <span className="mini-field__label">정렬 방식</span>
            <select
              className="mini-field__input"
              id="sort-by"
              aria-label="정렬 방식"
              defaultValue="latest"
            >
              <option value="latest">최신추가순</option>
              <option value="name">이름순</option>
            </select>
          </label>

          <label className="mini-field mini-field--grow">
            <span className="mini-field__label">이름 검색</span>
            <input
              className="mini-field__input"
              id="search-name"
              type="search"
              placeholder="이름으로 검색"
              aria-label="이름 검색"
            />
          </label>
        </div>
      </div>

      <form
        className="add-form is-hidden"
        id="add-form"
        autoComplete="off"
        aria-hidden="true"
        tabIndex={-1}
        onSubmit={noop}
      >
        <div className="add-form__grid">
          <label className="field">
            <span className="field__label">이름</span>
            <input className="field__input" name="name" type="text" placeholder="예: 홍길동" />
          </label>

          <label className="field">
            <span className="field__label">파트</span>
            <select className="field__input" name="part" defaultValue="">
              <option value="" disabled>
                선택
              </option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
            </select>
          </label>

          <label className="field field--span-2">
            <span className="field__label">관심 기술</span>
            <input
              className="field__input"
              name="skills"
              type="text"
              placeholder="예: HTML / CSS, JavaScript, React"
            />
          </label>

          <label className="field field--span-2">
            <span className="field__label">한 줄 소개</span>
            <input
              className="field__input"
              name="tagline"
              type="text"
              placeholder="요약 카드에 표시되는 한 줄 소개"
            />
          </label>

          <label className="field field--span-2">
            <span className="field__label">자기소개</span>
            <textarea
              className="field__input field__textarea"
              name="intro"
              rows={4}
              placeholder="상세 카드용 자기소개"
            />
          </label>

          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="field__input"
              name="email"
              type="email"
              placeholder="예: hong@example.com"
            />
          </label>

          <label className="field">
            <span className="field__label">Phone</span>
            <input className="field__input" name="phone" type="tel" placeholder="예: 010-1234-5678" />
          </label>

          <label className="field field--span-2">
            <span className="field__label">Website</span>
            <input
              className="field__input"
              name="website"
              type="url"
              placeholder="예: https://github.com/username"
            />
          </label>

          <label className="field field--span-2">
            <span className="field__label">한 마디</span>
            <input className="field__input" name="quote" type="text" placeholder="예: 함께 성장해요!" />
          </label>
        </div>

        <div className="add-form__actions">
          <button type="button" className="btn">
            랜덤 값 채우기
          </button>
          <button type="submit" className="btn btn--primary">
            추가하기
          </button>
          <button type="button" className="btn">
            취소
          </button>
        </div>
      </form>
    </section>
  );
}
