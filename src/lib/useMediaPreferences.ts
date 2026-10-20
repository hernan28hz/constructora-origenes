"use client";

import { useSyncExternalStore } from "react";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

const REDUCED = "(prefers-reduced-motion: reduce)";
const SMALL = "(max-width: 899.98px)";

/** Calidad de video que conviene cargar, o null si es mejor no cargarlo. */
export type VideoQuality = "hd" | "sd" | null;

function subscribe(onChange: () => void) {
  const queries = [REDUCED, SMALL].map((q) => window.matchMedia(q));
  queries.forEach((mq) => mq.addEventListener("change", onChange));
  return () => queries.forEach((mq) => mq.removeEventListener("change", onChange));
}

function videoQuality(): VideoQuality {
  if (window.matchMedia(REDUCED).matches) return null;
  const conn = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  if (conn?.saveData) return null;
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return null;
  if (window.matchMedia(SMALL).matches || conn?.effectiveType === "3g") return "sd";
  return "hd";
}

// En el servidor no se conoce la preferencia (`undefined`): se renderiza la
// imagen fija y el video o la secuencia se añaden en el cliente solo si
// conviene. `null` ya significa "sin movimiento": versión estática.
export function useVideoQuality() {
  return useSyncExternalStore<VideoQuality | undefined>(subscribe, videoQuality, () => undefined);
}
