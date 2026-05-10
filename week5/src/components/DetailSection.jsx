import LionDetailCard from './LionDetailCard.jsx';

export default function DetailSection({ lions }) {
  return (
    <section
      className="detail-section page-region page-region--detail"
      aria-labelledby="detail-heading"
    >
      <h2 id="detail-heading">상세 자기소개</h2>
      <div id="detail-list" className="detail-list" aria-label="상세 자기소개 목록">
        {lions.map((lion) => (
          <LionDetailCard key={lion.id} lion={lion} />
        ))}
      </div>
    </section>
  );
}
