export default function LionSummaryCard({ lion }) {
  const titleId = `sum-name-${lion.id}`;
  const cardClassName = lion.isSelf
    ? 'summary-card summary-card--self'
    : 'summary-card';

  return (
    <article
      className={cardClassName}
      aria-labelledby={titleId}
      aria-label={lion.isSelf ? '내 카드' : undefined}
    >
      <figure className="summary-card__figure">
        <img
          className="summary-card__photo"
          src={lion.photoUrl}
          width={120}
          height={120}
          alt={`${lion.name} 프로필 사진`}
        />
        <span className="summary-card__badge">{lion.badge}</span>
      </figure>
      <section className="summary-card__body" aria-label="요약 정보">
        <h3 id={titleId} className="summary-card__name">
          {lion.name}
        </h3>
        <p className="summary-card__role">{lion.part}</p>
        <p className="summary-card__tagline">{lion.tagline}</p>
      </section>
    </article>
  );
}
