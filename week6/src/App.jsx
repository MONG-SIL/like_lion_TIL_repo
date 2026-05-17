import './styles/style.css';
import { lions as initialLions } from './data/lions.js';
import { getVisibleLions } from './utils/lionUtils.js';
import { useLions } from './hooks/useLions.js';
import { useViewOptions } from './hooks/useViewOptions.js';
import { useRandomUserFetch } from './hooks/useRandomUserFetch.js';
import { useAddForm } from './hooks/useAddForm.js';
import ControlsSection from './components/ControlsSection.jsx';
import SummarySection from './components/SummarySection.jsx';
import DetailSection from './components/DetailSection.jsx';

export default function App() {
  const { lions, addLions, deleteLastLion, replaceAllExceptSelf, canDeleteLast } =
    useLions(initialLions);

  const {
    partFilter,
    sortBy,
    searchName,
    setPartFilter,
    setSortBy,
    setSearchName,
    viewOptions,
  } = useViewOptions();

  const {
    statusText,
    showRetry,
    isFetching,
    fetchAdd,
    fetchRefresh,
    fetchOneForForm,
    handleRetry,
  } = useRandomUserFetch({
    addLions,
    replaceAllExceptSelf,
    getLions: () => lions,
  });

  const addForm = useAddForm({
    onAdd: (lion) => addLions([lion]),
    fetchOneForForm,
    isFetching,
  });

  const visibleLions = getVisibleLions(lions, viewOptions);
  const isEmpty = visibleLions.length === 0;

  return (
    <>
      <header className="page-header">
        <h1>아기 사자 명단 대시보드</h1>
        <p className="page-lead">
          한 화면에서 명단 조작·요약 카드·상세 자기소개를 확인할 수 있는 UI입니다.
        </p>
      </header>

      <main className="page-main">
        <ControlsSection
          count={lions.length}
          canDeleteLast={canDeleteLast}
          onToggleForm={addForm.toggleForm}
          onDeleteLast={deleteLastLion}
          partFilter={partFilter}
          sortBy={sortBy}
          searchName={searchName}
          onPartFilterChange={setPartFilter}
          onSortByChange={setSortBy}
          onSearchNameChange={setSearchName}
          statusText={statusText}
          showRetry={showRetry}
          isFetching={isFetching}
          onFetchAdd1={() => fetchAdd(1)}
          onFetchAdd5={() => fetchAdd(5)}
          onFetchRefresh={fetchRefresh}
          onRetry={handleRetry}
          form={addForm}
        />
        <SummarySection lions={visibleLions} isEmpty={isEmpty} />
        <DetailSection lions={visibleLions} />
      </main>
    </>
  );
}
