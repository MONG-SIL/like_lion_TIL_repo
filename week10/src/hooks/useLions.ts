import { useEffect, useState } from 'react';
import type { Lion } from '../types/lion';
import type { LionRow } from '../types/database';
import { supabase } from '../lib/supabase';
import { lionToRow, rowsToLions } from '../utils/lionUtils';

export interface UseLionsReturn {
  lions: Lion[];
  loading: boolean;
  error: string | null;
  isMutating: boolean;
  addLions: (nextLions: Lion[]) => Promise<void>;
  deleteLastLion: () => Promise<void>;
  replaceAllExceptSelf: (nextLions: Lion[]) => Promise<void>;
  canDeleteLast: boolean;
}

async function fetchLionRows(): Promise<LionRow[]> {
  const { data, error } = await supabase
    .from('lions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export function useLions(isAuthenticated: boolean): UseLionsReturn {
  const [lions, setLions] = useState<Lion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  async function loadLions(): Promise<void> {
    try {
      const rows = await fetchLionRows();
      setLions(rowsToLions(rows));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function init(): Promise<void> {
      setLoading(true);
      try {
        const rows = await fetchLionRows();
        if (!mounted) return;
        setLions(rowsToLions(rows));
        setError(null);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    init();

    const channel = supabase
      .channel('lions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lions' },
        () => {
          void loadLions();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  async function addLions(nextLions: Lion[]): Promise<void> {
    if (!isAuthenticated || nextLions.length === 0) return;

    setIsMutating(true);
    try {
      const { error: insertError } = await supabase
        .from('lions')
        .insert(nextLions.map(lionToRow));

      if (insertError) {
        throw new Error(insertError.message);
      }

      await loadLions();
    } finally {
      setIsMutating(false);
    }
  }

  async function deleteLastLion(): Promise<void> {
    if (!isAuthenticated) return;

    const current = rowsToLions(await fetchLionRows());
    if (current.length === 0) return;
    if (current.length === 1 && current[0].isSelf) return;

    const last = current[current.length - 1];
    if (last.isSelf) return;

    setIsMutating(true);
    try {
      const { error: deleteError } = await supabase.from('lions').delete().eq('id', last.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      await loadLions();
    } finally {
      setIsMutating(false);
    }
  }

  async function replaceAllExceptSelf(nextLions: Lion[]): Promise<void> {
    if (!isAuthenticated) return;

    setIsMutating(true);
    try {
      const { error: deleteError } = await supabase.from('lions').delete().eq('is_self', false);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      if (nextLions.length > 0) {
        const { error: insertError } = await supabase
          .from('lions')
          .insert(nextLions.map(lionToRow));

        if (insertError) {
          throw new Error(insertError.message);
        }
      }

      await loadLions();
    } finally {
      setIsMutating(false);
    }
  }

  const canDeleteLast =
    isAuthenticated &&
    lions.length > 0 &&
    !(lions.length === 1 && lions[0].isSelf) &&
    !lions[lions.length - 1].isSelf;

  return {
    lions,
    loading,
    error,
    isMutating,
    addLions,
    deleteLastLion,
    replaceAllExceptSelf,
    canDeleteLast,
  };
}
