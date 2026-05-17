import { useState } from 'react';
import { fetchRandomUsers } from '../utils/randomUserApi.js';
import { lionFromApiUser } from '../utils/lionUtils.js';

export function useRandomUserFetch({ addLions, replaceAllExceptSelf, getLions }) {
  const [statusText, setStatusText] = useState('준비 완료');
  const [showRetry, setShowRetry] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [lastRequest, setLastRequest] = useState(null);

  async function runRequest(task, { successText = '완료!' } = {}) {
    try {
      setIsFetching(true);
      setShowRetry(false);
      setStatusText('불러오는 중...');
      await task();
      setStatusText(successText);
      window.setTimeout(() => {
        setStatusText('준비 완료');
        setShowRetry(false);
      }, 900);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusText(`불러오기 실패: ${msg}`);
      setShowRetry(true);
      throw err;
    } finally {
      setIsFetching(false);
    }
  }

  async function fetchAdd(count) {
    async function action() {
      const json = await fetchRandomUsers(count);
      const next = (json?.results || []).map(lionFromApiUser);
      addLions(next);
    }

    setLastRequest(() => action);
    await runRequest(action, { successText: `랜덤 ${count}명 추가 완료!` });
  }

  async function fetchRefresh() {
    async function action() {
      const lions = getLions();
      const self = lions.find((l) => l.isSelf) || null;
      const keepCount = lions.length;
      const target = Math.max(0, keepCount - (self ? 1 : 0));

      if (target === 0) {
        replaceAllExceptSelf([]);
        return;
      }

      const json = await fetchRandomUsers(target);
      const next = (json?.results || []).map(lionFromApiUser);
      replaceAllExceptSelf(next);
    }

    setLastRequest(() => action);
    await runRequest(action, { successText: '전체 새로고침 완료!' });
  }

  async function fetchOneForForm(onSuccess) {
    async function action() {
      const json = await fetchRandomUsers(1);
      const user = (json?.results || [])[0];
      const lion = lionFromApiUser(user);
      if (onSuccess) onSuccess(lion);
      return lion;
    }

    setLastRequest(() => action);
    await runRequest(action, { successText: '랜덤 값 채우기 완료!' });
  }

  async function handleRetry() {
    if (!lastRequest) return;
    try {
      await runRequest(lastRequest, { successText: '완료!' });
    } catch {
      // 실패 메시지는 runRequest에서 처리
    }
  }

  return {
    statusText,
    showRetry,
    isFetching,
    fetchAdd,
    fetchRefresh,
    fetchOneForForm,
    handleRetry,
  };
}
