import { getVisibleLions } from '../utils/lionUtils.js';
import { useViewOptions } from '../hooks/useViewOptions.js';
import { useAddForm } from '../hooks/useAddForm.js';
import ControlsSection from '../components/ControlsSection.jsx';
import SummarySection from '../components/SummarySection.jsx';

export default function ListPage({
  lions,
  canDeleteLast,
  deleteLastLion,
  addLions,
  fetchBag,
}) {
  const {
    partFilter,
    sortBy,
    searchName,
    setPartFilter,
    setSortBy,
    setSearchName,
    viewOptions,
  } = useViewOptions();

  const addForm = useAddForm({
    onAdd: (lion) => addLions([lion]),
    fetchOneForForm: fetchBag.fetchOneForForm,
    isFetching: fetchBag.isFetching,
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
          statusText={fetchBag.statusText}
          showRetry={fetchBag.showRetry}
          isFetching={fetchBag.isFetching}
          onFetchAdd1={() => fetchBag.fetchAdd(1)}
          onFetchAdd5={() => fetchBag.fetchAdd(5)}
          onFetchRefresh={fetchBag.fetchRefresh}
          onRetry={fetchBag.handleRetry}
          form={addForm}
        />
        <SummarySection lions={visibleLions} isEmpty={isEmpty} />
      </main>
    </>
  );
}
