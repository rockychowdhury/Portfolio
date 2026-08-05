"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseBackgroundRefreshOptions<T> {
  url: string;
  initial: T | null;
  enabled?: boolean;
  pollCount?: number;
  pollIntervalMs?: number;
}

function getUpdatedAt(value: unknown): number {
  if (!value || typeof value !== "object") return 0;
  const ts = (value as Record<string, unknown>).lastUpdated
    ?? (value as Record<string, unknown>).updatedAt;
  if (typeof ts !== "string" && typeof ts !== "number") return 0;
  const t = new Date(ts).getTime();
  return Number.isFinite(t) ? t : 0;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Seeds the UI from cached data immediately, then triggers a non-blocking
 * server-side cache refresh (?refresh=true) and live-updates the view when
 * the fresh document is written to MongoDB. The server never blocks on the
 * platform APIs in front of the response.
 */
export function useBackgroundRefresh<T>({
  url,
  initial,
  enabled = true,
  pollCount = 8,
  pollIntervalMs = 3000,
}: UseBackgroundRefreshOptions<T>) {
  const [data, setData] = useState<T | null>(initial);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const firedRef = useRef(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const triggerRes = await fetch(`${url}?refresh=true`, { cache: "no-store" });
      const triggerPayload = (await triggerRes.json()) as T;
      const baseline = getUpdatedAt(triggerPayload);
      if (triggerPayload) setData(triggerPayload);

      // Server only schedules a background write when the cache was stale
      // (or the fetch failed) — don't poll otherwise.
      const scheduled = triggerRes.headers.get("x-refresh-scheduled") === "1";
      if (!scheduled) return;

      for (let i = 0; i < pollCount; i++) {
        await sleep(pollIntervalMs);
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const fresh = (await res.json()) as T;
        if (getUpdatedAt(fresh) > baseline) {
          setData(fresh);
          return;
        }
      }
    } catch {
      // Silent — keep serving whatever cached data we have.
    } finally {
      setIsRefreshing(false);
    }
  }, [url, pollCount, pollIntervalMs]);

  useEffect(() => {
    if (!enabled || firedRef.current) return;
    firedRef.current = true;
    refresh();
  }, [enabled, refresh]);

  return { data, setData, refresh, isRefreshing };
}
