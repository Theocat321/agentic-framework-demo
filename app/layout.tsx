export const metadata = {
  title: 'Agentic Frameworks — Scrollytelling',
  description: 'Interactive scrollytelling of agentic AI frameworks with live diagrams.',
};

import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

