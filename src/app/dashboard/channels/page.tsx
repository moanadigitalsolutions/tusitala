import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Plus, Globe, Facebook, Twitter, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function ChannelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Channels</h1>
          <p className="text-muted-foreground">
            Manage your content publishing channels
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Channel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              WordPress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Connected</span>
              </div>
              <p className="text-sm text-muted-foreground">
                rjtreeservices.co.nz
              </p>
              <div className="text-xs text-muted-foreground">
                Last published: 2 hours ago
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              Facebook
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Not Connected</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your Facebook page to share posts automatically
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-blue-400" />
              Twitter/X
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Not Connected</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Share your content updates on Twitter/X
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-red-500" />
              Email Newsletter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Not Connected</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Send content updates to your email subscribers
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-purple-500" />
              Instagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Not Connected</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Share visual content on Instagram
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
