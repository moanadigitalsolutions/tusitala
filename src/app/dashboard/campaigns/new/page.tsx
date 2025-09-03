'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Target, Users, DollarSign } from 'lucide-react';

export default function NewCampaignPage() {
  const [campaign, setCampaign] = useState({
    name: '',
    description: '',
    target_audience: '',
    budget: '',
    start_date: '',
    end_date: '',
    objectives: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle campaign creation
    console.log('Creating campaign:', campaign);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Campaign</h1>
        <p className="text-muted-foreground">
          Set up a new marketing campaign for your content strategy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  placeholder="Enter campaign name"
                  value={campaign.name}
                  onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    placeholder="0.00"
                    className="pl-10"
                    value={campaign.budget}
                    onChange={(e) => setCampaign({ ...campaign, budget: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign goals and strategy"
                value={campaign.description}
                onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience</Label>
              <Input
                id="target_audience"
                placeholder="Who is this campaign targeting?"
                value={campaign.target_audience}
                onChange={(e) => setCampaign({ ...campaign, target_audience: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={campaign.start_date}
                  onChange={(e) => setCampaign({ ...campaign, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={campaign.end_date}
                  onChange={(e) => setCampaign({ ...campaign, end_date: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="objectives">Campaign Objectives</Label>
              <Textarea
                id="objectives"
                placeholder="What do you want to achieve with this campaign?"
                value={campaign.objectives}
                onChange={(e) => setCampaign({ ...campaign, objectives: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Create Campaign
          </Button>
          <Button type="button" variant="outline" className="flex-1">
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}
