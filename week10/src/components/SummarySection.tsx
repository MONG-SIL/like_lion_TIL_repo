import type { Lion } from '../types/lion';
import LionSummaryCard from './LionSummaryCard';

interface SummarySectionProps {
  lions: Lion[];
  isEmpty: boolean;
  visibleCount: number;
  totalCount: number;
}

export default function SummarySection({
  lions,
  isEmpty,
  visibleCount,
  totalCount,
}: SummarySectionProps) {
  const showFilteredCount = visibleCount !== totalCount;

  return (
    <section
      className="summary-section page-region page-region--summary"
      aria-labelledby="summary-heading"
    >
      <div className="summary-section__header">
        <h2 id="summary-heading">아기 사자 자기소개 요약</h2>
        {showFilteredCount ? (
          <p className="summary-section__count" aria-live="polite">
            전체 {totalCount}명 중 {visibleCount}명 표시
          </p>
        ) : null}
      </div>
      {isEmpty ? (
        <p className="empty-state" aria-live="polite">
          표시할 아기 사자가 없습니다. (필터/검색 조건을 확인해 주세요)
        </p>
      ) : (
        <div className="summary-grid" id="summary-grid">
          {lions.map((lion) => (
            <LionSummaryCard key={lion.id} lion={lion} />
          ))}
        </div>
      )}
    </section>
  );
}
