'use client';

import { MotionValue, useTransform } from 'framer-motion';
import { motion } from 'framer-motion';

type ArrowTokenProps = {
  path: Array<[number, number]>; // 0..100 space
  progress: MotionValue<number>; // 0..1
  size?: number; // length of arrow head
  color?: string;
  ariaLabel?: string;
  startTrim?: number; // trim at start in 0..100 units
  endTrim?: number;   // trim at end in 0..100 units
};

function pointOnPolyline(points: Array<[number, number]>, t: number) {
  if (points.length <= 1) return { x: points[0]?.[0] ?? 0, y: points[0]?.[1] ?? 0 };
  let total = 0;
  const segs: Array<{ a: [number, number]; b: [number, number]; len: number }> = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len });
    total += len;
  }
  const target = Math.max(0, Math.min(1, t)) * total;
  let acc = 0;
  for (const s of segs) {
    if (acc + s.len >= target) {
      const lt = s.len === 0 ? 0 : (target - acc) / s.len;
      return { x: s.a[0] + (s.b[0] - s.a[0]) * lt, y: s.a[1] + (s.b[1] - s.a[1]) * lt };
    }
    acc += s.len;
  }
  const last = points[points.length - 1];
  return { x: last[0], y: last[1] };
}

function trimPolyline(points: Array<[number, number]>, startTrim = 0, endTrim = 0) {
  if (points.length < 2) return points;
  const out = points.map(p => [...p] as [number, number]);
  if (startTrim > 0) {
    const a = out[0];
    const b = out[1];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    out[0] = [a[0] + (dx / len) * startTrim, a[1] + (dy / len) * startTrim];
  }
  if (endTrim > 0) {
    const n = out.length - 1;
    const a = out[n - 1];
    const b = out[n];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    out[n] = [b[0] - (dx / len) * endTrim, b[1] - (dy / len) * endTrim];
  }
  return out;
}

export function ArrowToken({ path, progress, size = 8, color = 'rgba(255,255,255,0.9)', ariaLabel, startTrim = 6, endTrim = 6 }: ArrowTokenProps) {
  const trimmed = trimPolyline(path, startTrim, endTrim);
  const posX = useTransform(progress, t => `${pointOnPolyline(trimmed, t).x}%`);
  const posY = useTransform(progress, t => `${pointOnPolyline(trimmed, t).y}%`);
  const angle = useTransform(progress, t => {
    const p1 = pointOnPolyline(trimmed, Math.max(0, Math.min(1, t)));
    const p2 = pointOnPolyline(trimmed, Math.max(0, Math.min(1, t + 0.001)));
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  });
  return (
    <motion.svg aria-label={ariaLabel} className="absolute" viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ left: posX, top: posY, transform: 'translate(-50%, -50%) rotate(0deg)', zIndex: 30 }}>
      <motion.g style={{ rotate: angle }} transform={`translate(${size / 2} ${size / 2})`}>
        <polygon points={`${-size / 2},${-size / 3} ${-size / 2},${size / 3} ${size / 2},0`} fill={color} />
      </motion.g>
    </motion.svg>
  );
}
