import { Link, useLocation, useParams } from 'react-router-dom';
import type { Lion, DetailLocationState } from '../types/lion';
import LionDetailCard from '../components/LionDetailCard';

interface DetailPageProps {
  lions: Lion[];
}

export default function DetailPage({ lions }: DetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as DetailLocationState | null;
  const listPath = state?.from || '/';
  const lion = lions.find((item) => item.id === id);

  return (
    <>
      <header className="page-header">
        <h1>아기 사자 상세 프로필</h1>
        <p className="page-lead">선택한 아기 사자의 상세 자기소개를 확인할 수 있습니다.</p>
      </header>

      <main className="page-main">
        <p className="controls-basic">
          <Link to={listPath} className="btn">
            목록으로 돌아가기
          </Link>
        </p>

        {lion ? (
          <section
            className="detail-section page-region page-region--detail"
            aria-labelledby="detail-heading"
          >
            <h2 id="detail-heading">상세 자기소개</h2>
            <div id="detail-list" className="detail-list" aria-label="상세 자기소개">
              <LionDetailCard lion={lion} />
            </div>
          </section>
        ) : (
          <p className="empty-state" aria-live="polite">
            해당 아기 사자를 찾을 수 없습니다.
          </p>
        )}
      </main>
    </>
  );
}
