import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';

export function UserNav() {
  const user = getCurrentUser();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
