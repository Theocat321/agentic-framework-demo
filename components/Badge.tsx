'use client';

import { motion } from 'framer-motion';

type BadgeProps = {
  label: string;
  tone?: 'accent' | 'success' | 'muted' | 'warn';
  className?: string;
};

export function Badge({ label, tone = 'accent', className }: BadgeProps) {
  const colors: Record<string, string> = {
    accent: 'ring-blue-400/50 bg-blue-400/10 text-blue-200',
    success: 'ring-emerald-400/50 bg-emerald-400/10 text-emerald-200',
    muted: 'ring-white/20 bg-white/5 text-white/80',
    warn: 'ring-amber-400/50 bg-amber-400/10 text-amber-200',
  };
  return (
    <motion.span
      className={`badge ${colors[tone]} ${className ?? ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {label}
    </motion.span>
  );
}

