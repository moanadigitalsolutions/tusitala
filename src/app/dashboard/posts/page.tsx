import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool, Plus } from 'lucide-react';

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Manage your content posts
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Pine Tree Removal in Stokes Valley</h3>
                  <p className="text-sm text-muted-foreground">Published to WordPress • 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Tree Pruning Best Practices</h3>
                  <p className="text-sm text-muted-foreground">Draft • 1 day ago</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Emergency Tree Services</h3>
                  <p className="text-sm text-muted-foreground">Scheduled • 3 days ago</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
