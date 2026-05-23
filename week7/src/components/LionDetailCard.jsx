export default function LionDetailCard({ lion }) {
  const titleId = `detail-name-${lion.id}`;

  return (
    <article className="detail-card" aria-labelledby={titleId}>
      <h3 id={titleId} className="detail-card__title">
        {lion.name}
      </h3>
      <dl className="detail-card__fields">
        <div className="detail-field">
          <dt className="detail-field__label">이름</dt>
          <dd className="detail-field__value">{lion.name}</dd>
        </div>
        <div className="detail-field">
          <dt className="detail-field__label">파트</dt>
          <dd className="detail-field__value">{lion.part}</dd>
        </div>
        <div className="detail-field">
          <dt className="detail-field__label">조직명</dt>
          <dd className="detail-field__value">{lion.organization}</dd>
        </div>
        <div className="detail-field detail-field--block">
          <dt className="detail-field__label">자기소개</dt>
          <dd className="detail-field__value detail-field__value--paragraph">{lion.intro}</dd>
        </div>
        <div className="detail-field detail-field--block">
          <dt className="detail-field__label">연락처</dt>
          <dd className="detail-field__value">
            <ul className="contact-list">
              {lion.contacts.map((row) => (
                <li key={`${lion.id}-${row.label}`} className="contact-list__item">
                  <span className="contact-list__key">{row.label}</span>{' '}
                  <span className="contact-list__val">
                    {row.href ? (
                      <a href={row.href} target="_blank" rel="noopener noreferrer">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="detail-field detail-field--block">
          <dt className="detail-field__label">관심 기술</dt>
          <dd className="detail-field__value">
            <ul className="skill-list">
              {lion.skills.map((skill) => (
                <li key={`${lion.id}-skill-${skill}`}>{skill}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="detail-field detail-field--block">
          <dt className="detail-field__label">한 마디</dt>
          <dd className="detail-field__value">{lion.quote}</dd>
        </div>
      </dl>
    </article>
  );
}
