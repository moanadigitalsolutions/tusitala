import { Bot, LayoutDashboard, PenTool, Rocket, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "Posts", icon: PenTool },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Rocket },
  { href: "/dashboard/channels", label: "Channels", icon: Share2 }
];

export function AppSidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="px-2 pt-2">
        <Button variant="ghost" className="w-full justify-start gap-2 text-base font-semibold" asChild>
          <Link href="/dashboard">
            <Bot className="h-5 w-5" /> Tusitala
          </Link>
        </Button>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Link href={item.href as any}>
                <Icon className="h-4 w-4" /> {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="p-2 text-xs text-muted-foreground">v0.1.0</div>
    </div>
  );
}