'use client';

import { MotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { motion } from 'framer-motion';

type TokenProps = {
  path: Array<[number, number]>; // polyline 0..100 space
  progress: MotionValue<number>; // 0..1
  color?: string; // css color
  size?: number; // px visual size
  shape?: 'dot' | 'card';
  ariaLabel?: string;
};

// Compute a point along a polyline for t in [0,1]
function pointOnPolyline(points: Array<[number, number]>, t: number) {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return { x: points[0][0], y: points[0][1] };
  // Precompute segment lengths
  let total = 0;
  const segs: Array<{ a: [number, number]; b: [number, number]; len: number }> = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    segs.push({ a, b, len });
    total += len;
  }
  const target = Math.max(0, Math.min(1, t)) * total;
  let acc = 0;
  for (const s of segs) {
    if (acc + s.len >= target) {
      const lt = s.len === 0 ? 0 : (target - acc) / s.len;
      const x = s.a[0] + (s.b[0] - s.a[0]) * lt;
      const y = s.a[1] + (s.b[1] - s.a[1]) * lt;
      return { x, y };
    }
    acc += s.len;
  }
  const last = points[points.length - 1];
  return { x: last[0], y: last[1] };
}

export function Token({ path, progress, color = 'var(--accent)', size = 9, shape = 'dot', ariaLabel }: TokenProps) {
  const reduce = useReducedMotion();
  const left = useTransform(progress, (t) => `${pointOnPolyline(path, reduce ? 0 : t).x}%`);
  const top = useTransform(progress, (t) => `${pointOnPolyline(path, reduce ? 0 : t).y}%`);
  const transform = 'translate(-50%, -50%)';
  return (
    <motion.div
      aria-label={ariaLabel}
      className={`absolute ${shape === 'dot' ? 'rounded-full' : 'rounded-md border border-white/10 bg-white/10 backdrop-blur-sm'} rm-hide-motion`}
      style={{ left, top, width: size, height: shape === 'dot' ? size : size * 1.8, transform, backgroundColor: shape === 'dot' ? color : 'rgba(255,255,255,0.08)', boxShadow: shape === 'dot' ? `0 0 0 2px rgba(255,255,255,0.5), 0 0 16px ${color}` : '0 2px 8px rgba(0,0,0,0.25)' }}
    />
  );
}
