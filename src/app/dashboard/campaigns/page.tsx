import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Plus, Calendar, Target } from 'lucide-react';

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Organize and manage your marketing campaigns
          </p>
        </div>
        <Button asChild>
          <Link href={"/dashboard/campaigns/new" as any}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-500" />
              Summer Tree Care
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Aug 1 - Aug 31, 2025</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>5 posts planned</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Focus on summer tree maintenance and safety tips for property owners.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-green-500" />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Ongoing</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>3 posts published</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Promote 24/7 emergency tree services and storm damage response.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-orange-500" />
              Winter Preparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>May 1 - July 31, 2025</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>8 posts planned</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Help customers prepare their trees for the winter months ahead.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
