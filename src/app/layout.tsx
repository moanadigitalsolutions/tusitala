import './globals.css';
import type { ReactNode } from 'react';
import { SidebarShell } from '@/components/sidebar-shell';

export const metadata = {
  title: 'Tusitala Platform',
  description: 'Content creation & marketing management platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <SidebarShell>{children}</SidebarShell>
      </body>
    </html>
  );
}
