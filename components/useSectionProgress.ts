'use client';

import { RefObject } from 'react';
import { useScroll } from 'framer-motion';

export function useSectionProgress(ref: RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return scrollYProgress;
}

