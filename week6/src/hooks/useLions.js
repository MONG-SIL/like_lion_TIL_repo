import { useState } from 'react';
import { prepareInitialLions } from '../utils/lionUtils.js';

export function useLions(initialLions) {
  const [lions, setLions] = useState(() => prepareInitialLions(initialLions));

  function addLions(nextLions) {
    setLions((prev) => [...prev, ...nextLions]);
  }

  function deleteLastLion() {
    setLions((prev) => {
      if (prev.length === 0) return prev;
      if (prev.length === 1 && prev[0].isSelf) return prev;
      const last = prev[prev.length - 1];
      if (last.isSelf) return prev;
      return prev.slice(0, -1);
    });
  }

  function replaceAllExceptSelf(nextLions) {
    setLions((prev) => {
      const self = prev.find((l) => l.isSelf) || null;
      return self ? [self, ...nextLions] : nextLions;
    });
  }

  const canDeleteLast =
    lions.length > 0 && !(lions.length === 1 && lions[0].isSelf) && !lions[lions.length - 1].isSelf;

  return {
    lions,
    addLions,
    deleteLastLion,
    replaceAllExceptSelf,
    canDeleteLast,
  };
}
