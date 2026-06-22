import { Link } from 'react-router-dom';
import { getVisibleLions } from '../utils/lionUtils';
import { useViewOptions } from '../hooks/useViewOptions';
import { useAddForm } from '../hooks/useAddForm';
import type { UseAuthReturn } from '../hooks/useAuth';
import type { UseLionsReturn } from '../hooks/useLions';
import type { UseRandomUserFetchReturn } from '../hooks/useRandomUserFetch';
import AuthBar from '../components/AuthBar';
import ControlsSection from '../components/ControlsSection';
import SummarySection from '../components/SummarySection';

interface HomePageProps {
  auth: UseAuthReturn;
  lionsBag: UseLionsReturn;
  fetchBag: UseRandomUserFetchReturn;
}

export default function HomePage({ auth, lionsBag, fetchBag }: HomePageProps) {
  const {
    lions,
    loading,
    error,
    isMutating,
    canDeleteLast,
    addLions,
    deleteLastLion,
  } = lionsBag;

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
    isFetching: fetchBag.isFetching || isMutating,
    isAuthenticated: auth.isAuthenticated,
  });

  const visibleLions = getVisibleLions(lions, viewOptions);
  const isEmpty = visibleLions.length === 0;
  const controlsDisabled = !auth.isAuthenticated || isMutating;

  return (
    <>
      <header className="page-header">
        <div className="page-header__row">
          <div>
            <h1>아기 사자 명단 대시보드</h1>
            <p className="page-lead">
              Supabase에 저장된 명단을 조회하고, 로그인한 사용자만 추가·삭제할 수 있습니다.
            </p>
          </div>
          {auth.isAuthenticated ? (
            <AuthBar userEmail={auth.userEmail} onSignOut={auth.signOut} />
          ) : (
            <Link to="/login" className="btn btn--primary">
              로그인
            </Link>
          )}
        </div>
      </header>

      <main className="page-main">
        {!auth.isAuthenticated ? (
          <p className="auth-notice" aria-live="polite">
            명단을 수정하려면 로그인이 필요합니다.{' '}
            <Link to="/login" className="auth-notice__link">
              로그인 페이지로 이동
            </Link>
          </p>
        ) : null}

        {loading ? (
          <p className="loading-state" aria-live="polite">
            명단을 불러오는 중...
          </p>
        ) : error ? (
          <p className="empty-state" role="alert">
            명단을 불러오지 못했습니다: {error}
          </p>
        ) : (
          <>
            <ControlsSection
              count={lions.length}
              canDeleteLast={canDeleteLast}
              onToggleForm={addForm.toggleForm}
              onDeleteLast={() => void deleteLastLion()}
              partFilter={partFilter}
              sortBy={sortBy}
              searchName={searchName}
              onPartFilterChange={setPartFilter}
              onSortByChange={setSortBy}
              onSearchNameChange={setSearchName}
              statusText={fetchBag.statusText}
              showRetry={fetchBag.showRetry}
              isFetching={fetchBag.isFetching || isMutating}
              onFetchAdd1={() => void fetchBag.fetchAdd(1)}
              onFetchAdd5={() => void fetchBag.fetchAdd(5)}
              onFetchRefresh={() => void fetchBag.fetchRefresh()}
              onRetry={() => void fetchBag.handleRetry()}
              form={addForm}
              controlsDisabled={controlsDisabled}
            />
            <SummarySection
              lions={visibleLions}
              isEmpty={isEmpty}
              visibleCount={visibleLions.length}
              totalCount={lions.length}
            />
          </>
        )}
      </main>
    </>
  );
}
