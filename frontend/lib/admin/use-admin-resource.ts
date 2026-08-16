"use client";

/**
 * List-loading hook for the admin tables.
 *
 * lib/hooks/use-async.ts only refetches on an explicit retry(), but these
 * screens refetch whenever a filter changes — and the search box needs
 * debouncing so typing doesn't fire a request per keystroke. Same fnRef
 * trick as useAsync: the loader can close over fresh state without
 * retriggering the effect.
 */

import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";

interface ResourceState<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
  /** Refetch with the current filters — call after a mutation. */
  refresh: () => void;
}

export function useAdminResource<T>(
  load: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
  debounceMs = 0,
): ResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [nonce, setNonce] = useState(0);

  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    const controller = new AbortController();

    // setLoading lives inside the timer callback, not the effect body: it
    // keeps the spinner from flashing during the debounce window, and
    // synchronous setState in an effect is a lint error here.
    const timer = setTimeout(() => {
      setLoading(true);
      loadRef
        .current(controller.signal)
        .then((result) => {
          if (!controller.signal.aborted) {
            setData(result);
            setError(null);
          }
        })
        .catch((err: unknown) => {
          if (!controller.signal.aborted) setError(err);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, debounceMs);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller owns the dep list; `load` is read through a ref
  }, [...deps, nonce, debounceMs]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, refresh };
}
