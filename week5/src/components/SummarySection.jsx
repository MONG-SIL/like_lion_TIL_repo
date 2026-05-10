import LionSummaryCard from './LionSummaryCard.jsx';

export default function SummarySection({ lions }) {
  return (
    <section
      className="summary-section page-region page-region--summary"
      aria-labelledby="summary-heading"
    >
      <h2 id="summary-heading">아기 사자 자기소개 요약</h2>
      <div className="summary-grid" id="summary-grid">
        {lions.map((lion) => (
          <LionSummaryCard key={lion.id} lion={lion} />
        ))}
      </div>
    </section>
  );
}
