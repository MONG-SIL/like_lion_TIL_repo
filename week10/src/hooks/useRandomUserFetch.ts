import { useState } from 'react';
import type { Lion } from '../types/lion';
import { fetchRandomUsers } from '../utils/randomUserApi';
import { lionFromApiUser } from '../utils/lionUtils';

type FetchTask = () => Promise<void>;

export interface UseRandomUserFetchParams {
  addLions: (lions: Lion[]) => void | Promise<void>;
  replaceAllExceptSelf: (lions: Lion[]) => void | Promise<void>;
  getLions: () => Lion[];
}

export interface UseRandomUserFetchReturn {
  statusText: string;
  showRetry: boolean;
  isFetching: boolean;
  fetchAdd: (count: number) => Promise<void>;
  fetchRefresh: () => Promise<void>;
  fetchOneForForm: (onSuccess?: (lion: Lion) => void) => Promise<Lion>;
  handleRetry: () => Promise<void>;
}

export function useRandomUserFetch({
  addLions,
  replaceAllExceptSelf,
  getLions,
}: UseRandomUserFetchParams): UseRandomUserFetchReturn {
  const [statusText, setStatusText] = useState<string>('준비 완료');
  const [showRetry, setShowRetry] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [lastRequest, setLastRequest] = useState<FetchTask | null>(null);

  async function runRequest(
    task: FetchTask,
    { successText = '완료!' }: { successText?: string } = {}
  ): Promise<void> {
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

  async function fetchAdd(count: number): Promise<void> {
    async function action(): Promise<void> {
      const json = await fetchRandomUsers(count);
      const next = (json?.results || []).map(lionFromApiUser);
      await addLions(next);
    }

    setLastRequest(() => action);
    await runRequest(action, { successText: `랜덤 ${count}명 추가 완료!` });
  }

  async function fetchRefresh(): Promise<void> {
    async function action(): Promise<void> {
      const lions = getLions();
      const self = lions.find((l) => l.isSelf) || null;
      const keepCount = lions.length;
      const target = Math.max(0, keepCount - (self ? 1 : 0));

      if (target === 0) {
        await replaceAllExceptSelf([]);
        return;
      }

      const json = await fetchRandomUsers(target);
      const next = (json?.results || []).map(lionFromApiUser);
      await replaceAllExceptSelf(next);
    }

    setLastRequest(() => action);
    await runRequest(action, { successText: '전체 새로고침 완료!' });
  }

  async function fetchOneForForm(onSuccess?: (lion: Lion) => void): Promise<Lion> {
    let resultLion!: Lion;

    async function action(): Promise<void> {
      const json = await fetchRandomUsers(1);
      const user = (json?.results || [])[0];
      resultLion = lionFromApiUser(user);
      if (onSuccess) onSuccess(resultLion);
    }

    setLastRequest(() => action);
    await runRequest(action, { successText: '랜덤 값 채우기 완료!' });
    return resultLion;
  }

  async function handleRetry(): Promise<void> {
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
