'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ContentEditor } from '@/components/content-editor';
import { WordPressPublisher } from '@/components/wordpress-publisher';
import { FeaturedImageUploader } from '@/components/featured-image-uploader';
import { CategoriesTags } from '@/components/categories-tags';
import { SEOFields } from '@/components/seo-fields';
import { ArrowLeft, Save, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishToWordPress, setPublishToWordPress] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [featuredMediaId, setFeaturedMediaId] = useState<number | null>(null);
  
  // Categories & Tags
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // SEO Fields
  const [excerpt, setExcerpt] = useState('');
  const [slug, setSlug] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyphrase, setFocusKeyphrase] = useState('');
  
  // Scheduling
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const handlePublishToWordPress = async () => {
    if (!title.trim() || !content.trim()) {
      console.error('Title and content are required');
      return;
    }

    // Set the flag to show the WordPress publisher component which will trigger publishing
    setPublishToWordPress(true);
  };

  const handleSave = () => {
    // Handle saving the post
    console.log('Saving post:', { 
      title, 
      content, 
      publishToWordPress, 
      featuredImage, 
      featuredMediaId,
      selectedCategories,
      selectedTags,
      excerpt,
      slug,
      metaDescription,
      focusKeyphrase
    });
  };

  const handleImageSelect = (file: File | null, previewUrl: string | null) => {
    setFeaturedImage(file);
    setFeaturedImagePreview(previewUrl);
    // Reset media ID when a new image is selected
    setFeaturedMediaId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-muted-foreground">
            Write and publish your content
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter post title..."
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                  Content
                </label>
                <ContentEditor
                  content={content}
                  onChange={setContent}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <FeaturedImageUploader
            onImageSelect={handleImageSelect}
            currentImage={featuredImagePreview}
          />
          
          <CategoriesTags
            selectedCategories={selectedCategories}
            selectedTags={selectedTags}
            onCategoriesChange={setSelectedCategories}
            onTagsChange={setSelectedTags}
          />
          
          <SEOFields
            title={title}
            excerpt={excerpt}
            slug={slug}
            metaDescription={metaDescription}
            focusKeyphrase={focusKeyphrase}
            onExcerptChange={setExcerpt}
            onSlugChange={setSlug}
            onMetaDescriptionChange={setMetaDescription}
            onFocusKeyphraseChange={setFocusKeyphrase}
          />
          
          {/* Scheduling Section */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="schedule" 
                  checked={isScheduled}
                  onCheckedChange={(checked) => setIsScheduled(checked === true)}
                />
                <Label htmlFor="schedule">Schedule for later</Label>
              </div>
              
              {isScheduled && (
                <div>
                  <Label htmlFor="scheduleDate">Publish Date & Time</Label>
                  <Input
                    id="scheduleDate"
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Post will be automatically published at the scheduled time
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Publishing Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleSave} variant="outline" className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                
                <Button 
                  onClick={handlePublishToWordPress}
                  className="flex-1"
                  disabled={!title.trim() || !content.trim()}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Publish to WordPress
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                All fields above will be included when publishing to WordPress
              </p>
            </CardContent>
          </Card>

          {publishToWordPress && (
            <WordPressPublisher
              title={title}
              content={content}
              featuredImage={featuredImage}
              featuredMediaId={featuredMediaId}
              onMediaUpload={setFeaturedMediaId}
              categories={selectedCategories}
              tags={selectedTags}
              excerpt={excerpt}
              slug={slug}
              metaDescription={metaDescription}
              focusKeyphrase={focusKeyphrase}
              scheduledDate={isScheduled ? scheduledDate : undefined}
              onPublishSuccess={(result: any) => {
                console.log('Published successfully:', result);
                alert(`Successfully published: ${result.title}`);
                // Reset the publishing state after success
                setPublishToWordPress(false);
              }}
              onPublishError={(error: string) => {
                console.error('Publishing failed:', error);
                alert(`Publishing failed: ${error}`);
                // Reset the publishing state after error
                setPublishToWordPress(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
