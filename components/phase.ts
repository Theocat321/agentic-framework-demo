export type PhaseInfo = {
  phase: 0 | 1 | 2; // A, B, C
  a: number; // weight 0..1 in phase A
  b: number; // weight 0..1 in phase B
  c: number; // weight 0..1 in phase C
  tInPhase: number; // 0..1
};

export function phaseFromProgress(p: number): PhaseInfo {
  const clamp = (x: number) => Math.max(0, Math.min(1, x));
  const a = clamp((1 / 3 - p) * 3);
  const b = clamp((p - 1 / 3) * 3) * clamp((2 / 3 - p) * 3);
  const c = clamp((p - 2 / 3) * 3);
  let phase: 0 | 1 | 2 = 0;
  if (p < 1 / 3) phase = 0; else if (p < 2 / 3) phase = 1; else phase = 2;
  const segStart = phase === 0 ? 0 : phase === 1 ? 1 / 3 : 2 / 3;
  const segEnd = phase === 0 ? 1 / 3 : phase === 1 ? 2 / 3 : 1;
  const tInPhase = segEnd === segStart ? 0 : (p - segStart) / (segEnd - segStart);
  return { phase, a: clamp(a), b: clamp(b > 0 ? 1 : 0), c: clamp(c), tInPhase };
}

export function segmentT(p: number, start: number, end: number) {
  const t = (p - start) / (end - start);
  return Math.max(0, Math.min(1, t));
}

