'use client';

import { ReactNode, useId, forwardRef } from 'react';
import { motion } from 'framer-motion';

type SectionShellProps = {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  callout: string;
  children: ReactNode; // diagram
};

export const SectionShell = forwardRef<HTMLElement, SectionShellProps>(function SectionShell({ id, title, subtitle, bullets, callout, children }: SectionShellProps, ref) {
  const headingId = useId();
  return (
    <section ref={ref} id={id} role="region" aria-labelledby={headingId} className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
        <div className="space-y-6 order-2 lg:order-1">
          <div>
            <h2 id={headingId} className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm sm:text-base text-[color:var(--muted)]">{subtitle}</p>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-white/90">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">What to use it for</p>
            <p className="mt-1 text-sm sm:text-base">{callout}</p>
          </div>
        </div>
        <motion.div className="order-1 lg:order-2" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
});
