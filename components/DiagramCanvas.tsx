'use client';

import { ReactNode } from 'react';

type DiagramCanvasProps = {
  title: string;
  legend?: ReactNode;
  children: ReactNode;
  ariaLabel?: string;
};

export function DiagramCanvas({ title, legend, children, ariaLabel }: DiagramCanvasProps) {
  return (
    <figure aria-label={ariaLabel ?? title} role="img" className="w-full">
      <div className="relative w-full rounded-2xl border border-white/10 bg-[color:var(--panel)] grid-bg shadow-soft overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden />
        <div className="relative aspect-[16/10] w-full">
          {/* Diagram content */}
          {children}
          {/* Subtle frame gradient */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" aria-hidden />
        </div>
        {legend && (
          <figcaption className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--muted)]">
            {legend}
          </figcaption>
        )}
      </div>
      <span className="sr-only">{title}</span>
    </figure>
  );
}

