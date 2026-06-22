import { Link, useLocation } from 'react-router-dom';
import type { Lion } from '../types/lion';

interface LionSummaryCardProps {
  lion: Lion;
}

export default function LionSummaryCard({ lion }: LionSummaryCardProps) {
  const location = useLocation();
  const titleId = `sum-name-${lion.id}`;
  const cardClassName = lion.isSelf ? 'summary-card summary-card--self' : 'summary-card';
  const listPath = `${location.pathname}${location.search}`;

  return (
    <Link
      to={`/lions/${lion.id}`}
      state={{ from: listPath }}
      className={cardClassName}
      aria-labelledby={titleId}
      aria-label={lion.isSelf ? `${lion.name} 내 카드, 상세 보기` : `${lion.name} 상세 보기`}
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
        <span className="summary-card__cta">상세 보기</span>
      </section>
    </Link>
  );
}
