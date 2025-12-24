'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

type NodeProps = {
  x: number; // 0..100
  y: number; // 0..100
  w?: number; // percent width
  h?: number; // percent height
  label: ReactNode;
  intensity?: MotionValue<number> | number; // 0..1
  pill?: boolean;
};

export function Node({ x, y, w = 18, h = 14, label, intensity, pill }: NodeProps) {
  const intMv: MotionValue<number> | undefined = typeof intensity === 'number' ? undefined : intensity;
  const opacity = intMv ? useTransform(intMv, [0, 1], [0.65, 1]) : undefined;
  const shadow = intMv ? useTransform(intMv, v => `0 8px 24px rgba(0,0,0,${0.06 + v * 0.1})`) : undefined;
  const transform = intMv ? useTransform(intMv, v => `translate(-50%, -50%) scale(${1 + v * 0.03})`) : 'translate(-50%, -50%)';
  return (
    <motion.div
      aria-label={typeof label === 'string' ? label : undefined}
      className={`absolute select-none ${pill ? 'rounded-full' : 'rounded-xl'} border border-white/10 bg-white/5 text-[13px] text-white/90 flex items-center justify-center text-center px-2 shadow-soft`}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, transform, opacity, boxShadow: shadow as any }}
    >
      <span className="px-1 leading-tight">{label}</span>
      {intMv && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2"
          style={{
            opacity: useTransform(intMv, [0, 1], [0, 0.8]),
            boxShadow: useTransform(intMv, v => `0 0 0 0 rgba(96,165,250,0.0), 0 0 24px ${v * 0.5}px rgba(96,165,250,0.5)`),
            borderColor: useTransform(intMv, v => `rgba(96,165,250,${0.3 + v * 0.6})`),
          }}
        />
      )}
    </motion.div>
  );
}
