'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import { useId, useMemo } from 'react';

type EdgeProps = {
  points: Array<[number, number]>; // in 0..100 space
  active?: MotionValue<number> | number; // 0..1
  dashed?: boolean;
  label?: string;
  draw?: MotionValue<number>; // 0..1 draw-on progress
  thickness?: number;
};

function pathLength(points: Array<[number, number]>) {
  let len = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    len += Math.hypot(x2 - x1, y2 - y1);
  }
  return len || 0.0001;
}

export function Edge({ points, active, dashed, label, draw, thickness = 2 }: EdgeProps) {
  const id = useId();
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(' ');
  const actMv: MotionValue<number> | undefined = typeof active === 'number' ? undefined : active;
  const alpha = actMv ?? undefined;
  const strokeWidth = actMv ? useTransform(actMv, [0, 1], [thickness * 0.9, thickness * 1.4]) : thickness;
  const glow = actMv ? useTransform(actMv, v => `rgba(96,165,250,${v * 0.5})`) : 'rgba(96,165,250,0.15)';
  const len = useMemo(() => pathLength(points), [points]);
  const dashArray = draw ? useTransform(draw, () => `${len} ${len}`) : undefined;
  const dashOffset = draw ? useTransform(draw, (v) => `${(1 - Math.max(0, Math.min(1, v))) * len}`) : undefined;
  const arrowPos = points[points.length - 1];
  const last = points[points.length - 1];
  const prev = points[points.length - 2] ?? last;
  const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0]) * 180 / Math.PI;
  return (
    <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={label}>
      <defs>
        <linearGradient id={`grad-${id}`} gradientUnits="userSpaceOnUse" x1={points[0][0]} y1={points[0][1]} x2={points[points.length-1][0]} y2={points[points.length-1][1]}>
          <stop offset="0%" stopColor="rgba(148,163,184,0.4)" />
          <stop offset="100%" stopColor="rgba(96,165,250,0.9)" />
        </linearGradient>
      </defs>
      {/* Base path (very subtle when inactive) */}
      <motion.path d={path} fill="none" stroke={'rgba(148,163,184,0.18)'} strokeWidth={typeof strokeWidth === 'number' ? strokeWidth : 1.4} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" strokeDasharray={dashed ? '4 3' : undefined} />
      {/* Glow (fades with presence) */}
      <motion.path d={path} fill="none" stroke={glow as any} strokeWidth={typeof strokeWidth === 'number' ? strokeWidth : 1.6} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ opacity: alpha as any }} />
      {/* Draw-on highlight (fades with presence) */}
      <motion.path d={path} fill="none" stroke={`url(#grad-${id})`} strokeWidth={strokeWidth as any} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" strokeDasharray={draw ? (dashArray as any) : (dashed ? '4 3' : undefined)} strokeDashoffset={draw ? (dashOffset as any) : undefined} style={{ opacity: alpha as any }} />
      {/* Arrow head (separate so we can fade it) */}
      <motion.g style={{ opacity: alpha as any }} transform={`translate(${arrowPos[0]} ${arrowPos[1]}) rotate(${angle})`}>
        <path d="M 0 -2 L 0 2 L 6 0 z" fill="rgba(255,255,255,0.75)" />
      </motion.g>
    </svg>
  );
}
