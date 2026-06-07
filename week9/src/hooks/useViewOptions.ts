import { useSearchParams } from 'react-router-dom';
import type { LionPart, PartFilter, SortBy, ViewOptions } from '../types/lion';
import { normalizeText } from '../utils/lionUtils';

const VALID_PARTS: LionPart[] = ['Frontend', 'Backend', 'Design'];

function readPartFilter(searchParams: URLSearchParams): PartFilter {
  const part = searchParams.get('part');
  if (!part) return 'all';
  return VALID_PARTS.includes(part as LionPart) ? (part as LionPart) : 'all';
}

function readSortBy(searchParams: URLSearchParams): SortBy {
  const sort = searchParams.get('sort');
  return sort === 'name' ? 'name' : 'latest';
}

function readSearchName(searchParams: URLSearchParams): string {
  return searchParams.get('search') || '';
}

function buildSearchParams(partFilter: PartFilter, sortBy: SortBy, searchName: string): URLSearchParams {
  const next = new URLSearchParams();

  if (partFilter !== 'all' && VALID_PARTS.includes(partFilter)) {
    next.set('part', partFilter);
  }
  if (sortBy === 'name') {
    next.set('sort', 'name');
  }

  const q = normalizeText(searchName);
  if (q) {
    next.set('search', q);
  }

  return next;
}

export interface UseViewOptionsReturn {
  partFilter: PartFilter;
  sortBy: SortBy;
  searchName: string;
  setPartFilter: (value: PartFilter) => void;
  setSortBy: (value: SortBy) => void;
  setSearchName: (value: string) => void;
  viewOptions: ViewOptions;
}

export function useViewOptions(): UseViewOptionsReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const partFilter = readPartFilter(searchParams);
  const sortBy = readSortBy(searchParams);
  const searchName = readSearchName(searchParams);

  function updateViewOptions(nextPart: PartFilter, nextSort: SortBy, nextSearch: string): void {
    setSearchParams(buildSearchParams(nextPart, nextSort, nextSearch), { replace: true });
  }

  function setPartFilter(value: PartFilter): void {
    updateViewOptions(value, sortBy, searchName);
  }

  function setSortBy(value: SortBy): void {
    updateViewOptions(partFilter, value, searchName);
  }

  function setSearchName(value: string): void {
    updateViewOptions(partFilter, sortBy, value);
  }

  return {
    partFilter,
    sortBy,
    searchName,
    setPartFilter,
    setSortBy,
    setSearchName,
    viewOptions: {
      part: partFilter,
      sortBy,
      searchName,
    },
  };
}
