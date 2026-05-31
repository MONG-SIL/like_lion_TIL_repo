import { useState } from 'react';
import type { Lion, LionSeed } from '../types/lion';
import { prepareInitialLions } from '../utils/lionUtils';

export interface UseLionsReturn {
  lions: Lion[];
  addLions: (nextLions: Lion[]) => void;
  deleteLastLion: () => void;
  replaceAllExceptSelf: (nextLions: Lion[]) => void;
  canDeleteLast: boolean;
}

export function useLions(initialLions: LionSeed[]): UseLionsReturn {
  const [lions, setLions] = useState<Lion[]>(() => prepareInitialLions(initialLions));

  function addLions(nextLions: Lion[]): void {
    setLions((prev) => [...prev, ...nextLions]);
  }

  function deleteLastLion(): void {
    setLions((prev) => {
      if (prev.length === 0) return prev;
      if (prev.length === 1 && prev[0].isSelf) return prev;
      const last = prev[prev.length - 1];
      if (last.isSelf) return prev;
      return prev.slice(0, -1);
    });
  }

  function replaceAllExceptSelf(nextLions: Lion[]): void {
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
