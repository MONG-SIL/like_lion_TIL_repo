import './styles/style.css';
import { lions } from './data/lions.js';
import ControlsSection from './components/ControlsSection.jsx';
import SummarySection from './components/SummarySection.jsx';
import DetailSection from './components/DetailSection.jsx';

export default function App() {
  return (
    <>
      <header className="page-header">
        <h1>아기 사자 명단 대시보드</h1>
        <p className="page-lead">
          한 화면에서 명단 조작·요약 카드·상세 자기소개를 확인할 수 있는 UI입니다.
        </p>
      </header>

      <main className="page-main">
        <ControlsSection count={lions.length} />
        <SummarySection lions={lions} />
        <DetailSection lions={lions} />
      </main>
    </>
  );
}
