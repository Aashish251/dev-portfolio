/** Caps WebGL / canvas DPR by viewport width and reduced-motion preference. */
export function cappedDevicePixelRatio(canvasWidth) {
  const raw = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 1;
  }
  const w = canvasWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1024);
  if (w < 420) return Math.min(raw, 1.1);
  if (w < 720) return Math.min(raw, 1.3);
  return Math.min(raw, 1.5);
}
