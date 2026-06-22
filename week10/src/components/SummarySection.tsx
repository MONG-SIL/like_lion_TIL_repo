import type { Lion } from '../types/lion';
import LionSummaryCard from './LionSummaryCard';

interface SummarySectionProps {
  lions: Lion[];
  isEmpty: boolean;
}

export default function SummarySection({ lions, isEmpty }: SummarySectionProps) {
  return (
    <section
      className="summary-section page-region page-region--summary"
      aria-labelledby="summary-heading"
    >
      <h2 id="summary-heading">아기 사자 자기소개 요약</h2>
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
