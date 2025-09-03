'use client';

import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import * as React from 'react';
import { AppSidebar } from '@/components/app-sidebar';

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-0 top-0 h-full w-64 border-r bg-card/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AppSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
