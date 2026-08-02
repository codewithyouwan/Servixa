"use client";

/** Generic async data hook: loading / error / data + retry. */

import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

interface Settled<T> {
  /** Which fetch attempt this result belongs to (-1 = none yet). */
  attempt: number;
  data: T | null;
  error: Error | null;
}

export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>): AsyncState<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T>>({ attempt: -1, data: null, error: null });

  // Keep the latest fetcher without re-triggering the fetch effect.
  // (Declared first so it runs before the fetch effect each commit.)
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    const controller = new AbortController();
    fnRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setSettled({ attempt, data, error: null });
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setSettled({
            attempt,
            data: null,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // Loading whenever the settled result doesn't belong to the current attempt.
  const loading = settled.attempt !== attempt;

  return { data: settled.data, loading, error: loading ? null : settled.error, retry };
}
