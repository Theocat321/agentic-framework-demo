export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function trail(t: number, offset: number) {
  return clamp01(t - offset);
}

