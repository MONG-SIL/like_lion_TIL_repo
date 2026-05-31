import type { ChangeEvent } from 'react';
import type { PartFilter, SortBy } from '../types/lion';
import type { UseAddFormReturn } from '../hooks/useAddForm';

interface ControlsSectionProps {
  count: number;
  canDeleteLast: boolean;
  onToggleForm: () => void;
  onDeleteLast: () => void;
  partFilter: PartFilter;
  sortBy: SortBy;
  searchName: string;
  onPartFilterChange: (value: PartFilter) => void;
  onSortByChange: (value: SortBy) => void;
  onSearchNameChange: (value: string) => void;
  statusText: string;
  showRetry: boolean;
  isFetching: boolean;
  onFetchAdd1: () => void;
  onFetchAdd5: () => void;
  onFetchRefresh: () => void;
  onRetry: () => void;
  form: UseAddFormReturn;
}

export default function ControlsSection({
  count,
  canDeleteLast,
  onToggleForm,
  onDeleteLast,
  partFilter,
  sortBy,
  searchName,
  onPartFilterChange,
  onSortByChange,
  onSearchNameChange,
  statusText,
  showRetry,
  isFetching,
  onFetchAdd1,
  onFetchAdd5,
  onFetchRefresh,
  onRetry,
  form,
}: ControlsSectionProps) {
  const {
    isOpen,
    form: formValues,
    errors,
    canSubmit,
    closeForm,
    updateField,
    handleSubmit,
    handleFillRandom,
    isFillDisabled,
  } = form;

  const formClassName = isOpen ? 'add-form' : 'add-form is-hidden';

  function handlePartFilterChange(e: ChangeEvent<HTMLSelectElement>): void {
    onPartFilterChange(e.target.value as PartFilter);
  }

  function handleSortByChange(e: ChangeEvent<HTMLSelectElement>): void {
    onSortByChange(e.target.value as SortBy);
  }

  function handleSearchNameChange(e: ChangeEvent<HTMLInputElement>): void {
    onSearchNameChange(e.target.value);
  }

  return (
    <section
      className="controls-section page-region page-region--controls"
      aria-label="명단 조작 및 추가 폼"
    >
      <div className="controls-groups">
        <div className="controls-basic" aria-label="기본 조작">
          <button type="button" className="btn" onClick={onToggleForm}>
            아기 사자 추가
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onDeleteLast}
            disabled={!canDeleteLast}
          >
            마지막 아기 사자 삭제
          </button>
          <p className="controls-bar__count" aria-live="polite">
            총 {count}명
          </p>
        </div>

        <div className="controls-fetch" aria-label="외부 데이터 불러오기">
          <div className="fetch-controls">
            <button type="button" className="btn" onClick={onFetchAdd1} disabled={isFetching}>
              랜덤 1명 추가
            </button>
            <button type="button" className="btn" onClick={onFetchAdd5} disabled={isFetching}>
              랜덤 5명 추가
            </button>
            <button type="button" className="btn" onClick={onFetchRefresh} disabled={isFetching}>
              전체 새로고침
            </button>
          </div>
          <div className="request-status" aria-label="외부 요청 상태">
            <p className="request-status__text" aria-live="polite">
              {statusText}
            </p>
            {showRetry ? (
              <button type="button" className="btn btn--danger" onClick={onRetry}>
                재시도
              </button>
            ) : null}
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
              value={partFilter}
              onChange={handlePartFilterChange}
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
              value={sortBy}
              onChange={handleSortByChange}
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
              value={searchName}
              onChange={handleSearchNameChange}
            />
          </label>
        </div>
      </div>

      <form
        className={formClassName}
        id="add-form"
        autoComplete="off"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onSubmit={handleSubmit}
      >
        <div className="add-form__grid">
          <label className="field">
            <span className="field__label">이름</span>
            <input
              className="field__input"
              name="name"
              type="text"
              placeholder="예: 홍길동"
              value={formValues.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            <p className="field__error" aria-live="polite">
              {errors.name || ''}
            </p>
          </label>

          <label className="field">
            <span className="field__label">파트</span>
            <select
              className="field__input"
              name="part"
              value={formValues.part}
              onChange={(e) => updateField('part', e.target.value)}
            >
              <option value="" disabled>
                선택
              </option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
            </select>
            <p className="field__error" aria-live="polite">
              {errors.part || ''}
            </p>
          </label>

          <label className="field field--span-2">
            <span className="field__label">관심 기술</span>
            <input
              className="field__input"
              name="skills"
              type="text"
              placeholder="예: HTML / CSS, JavaScript, React"
              value={formValues.skills}
              onChange={(e) => updateField('skills', e.target.value)}
            />
            <p className="field__error" aria-live="polite">
              {errors.skills || ''}
            </p>
          </label>

          <label className="field field--span-2">
            <span className="field__label">한 줄 소개</span>
            <input
              className="field__input"
              name="tagline"
              type="text"
              placeholder="요약 카드에 표시되는 한 줄 소개"
              value={formValues.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
            />
            <p className="field__error" aria-live="polite">
              {errors.tagline || ''}
            </p>
          </label>

          <label className="field field--span-2">
            <span className="field__label">자기소개</span>
            <textarea
              className="field__input field__textarea"
              name="intro"
              rows={4}
              placeholder="상세 카드용 자기소개"
              value={formValues.intro}
              onChange={(e) => updateField('intro', e.target.value)}
            />
            <p className="field__error" aria-live="polite">
              {errors.intro || ''}
            </p>
          </label>

          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="field__input"
              name="email"
              type="email"
              placeholder="예: hong@example.com"
              value={formValues.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <p className="field__error" aria-live="polite">
              {errors.email || ''}
            </p>
          </label>

          <label className="field">
            <span className="field__label">Phone</span>
            <input
              className="field__input"
              name="phone"
              type="tel"
              placeholder="예: 010-1234-5678"
              value={formValues.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            <p className="field__error" aria-live="polite">
              {errors.phone || ''}
            </p>
          </label>

          <label className="field field--span-2">
            <span className="field__label">Website</span>
            <input
              className="field__input"
              name="website"
              type="url"
              placeholder="예: https://github.com/username"
              value={formValues.website}
              onChange={(e) => updateField('website', e.target.value)}
            />
            <p className="field__error" aria-live="polite">
              {errors.website || ''}
            </p>
          </label>

          <label className="field field--span-2">
            <span className="field__label">한 마디</span>
            <input
              className="field__input"
              name="quote"
              type="text"
              placeholder="예: 함께 성장해요!"
              value={formValues.quote}
              onChange={(e) => updateField('quote', e.target.value)}
            />
            <p className="field__error" aria-live="polite">
              {errors.quote || ''}
            </p>
          </label>
        </div>

        <div className="add-form__actions">
          <button
            type="button"
            className="btn"
            onClick={handleFillRandom}
            disabled={isFillDisabled}
          >
            랜덤 값 채우기
          </button>
          <button type="submit" className="btn btn--primary" disabled={!canSubmit}>
            추가하기
          </button>
          <button type="button" className="btn" onClick={closeForm}>
            취소
          </button>
        </div>
      </form>
    </section>
  );
}
