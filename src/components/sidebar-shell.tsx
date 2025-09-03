// Placeholder sidebar shell component - replace with shadcn/ui block implementation
import * as React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { UserNav } from '@/components/user-nav';
import { MobileNav } from '@/components/mobile-nav';

export function SidebarShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-60 border-r bg-card/30 hidden md:block">
        <AppSidebar className="h-full" />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <MobileNav />
            <div className="font-semibold">Tusitala</div>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
