import { useSearchParams } from 'react-router-dom';
import { normalizeText } from '../utils/lionUtils.js';

const VALID_PARTS = ['Frontend', 'Backend', 'Design'];

function readPartFilter(searchParams) {
  const part = searchParams.get('part');
  if (!part) return 'all';
  return VALID_PARTS.includes(part) ? part : 'all';
}

function readSortBy(searchParams) {
  const sort = searchParams.get('sort');
  return sort === 'name' ? 'name' : 'latest';
}

function readSearchName(searchParams) {
  return searchParams.get('search') || '';
}

function buildSearchParams(partFilter, sortBy, searchName) {
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

export function useViewOptions() {
  const [searchParams, setSearchParams] = useSearchParams();

  const partFilter = readPartFilter(searchParams);
  const sortBy = readSortBy(searchParams);
  const searchName = readSearchName(searchParams);

  function updateViewOptions(nextPart, nextSort, nextSearch) {
    setSearchParams(buildSearchParams(nextPart, nextSort, nextSearch), { replace: true });
  }

  function setPartFilter(value) {
    updateViewOptions(value, sortBy, searchName);
  }

  function setSortBy(value) {
    updateViewOptions(partFilter, value, searchName);
  }

  function setSearchName(value) {
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
