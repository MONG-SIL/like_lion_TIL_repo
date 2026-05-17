import { useState } from 'react';

export function useViewOptions() {
  const [partFilter, setPartFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [searchName, setSearchName] = useState('');

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
