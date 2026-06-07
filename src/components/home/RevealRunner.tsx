"use client";

import { useScrollReveal } from "./hooks";

/** Mounts the IntersectionObserver fallback for `.reveal` elements. Renders nothing. */
export function RevealRunner() {
  useScrollReveal();
  return null;
}
