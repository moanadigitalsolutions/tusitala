import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool, Rocket, Share2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your content creation platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 launching this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Channels</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              WordPress, Social, Email
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground">
              vs. last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Pine Tree Removal in Stokes Valley
                </p>
                <p className="text-sm text-muted-foreground">
                  Published to WordPress • 2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Tree Pruning Best Practices
                </p>
                <p className="text-sm text-muted-foreground">
                  Draft • 1 day ago
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Emergency Tree Services
                </p>
                <p className="text-sm text-muted-foreground">
                  Scheduled • 3 days ago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/posts/new" className="block">
              <div className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors">
                <PenTool className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Create New Post</p>
                  <p className="text-sm text-muted-foreground">Write and publish content</p>
                </div>
              </div>
            </Link>
            
            <Link href={"/dashboard/campaigns/new" as any} className="block">
              <div className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors">
                <Rocket className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">New Campaign</p>
                  <p className="text-sm text-muted-foreground">Plan your next campaign</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/channels" className="block">
              <div className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors">
                <Share2 className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Manage Channels</p>
                  <p className="text-sm text-muted-foreground">Configure publishing channels</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
