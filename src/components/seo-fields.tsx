'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Calendar, Link as LinkIcon } from 'lucide-react';

interface SEOFieldsProps {
  excerpt: string;
  slug: string;
  metaDescription: string;
  onExcerptChange: (excerpt: string) => void;
  onSlugChange: (slug: string) => void;
  onMetaDescriptionChange: (description: string) => void;
  title?: string;
  disabled?: boolean;
}

export function SEOFields({
  excerpt,
  slug,
  metaDescription,
  onExcerptChange,
  onSlugChange,
  onMetaDescriptionChange,
  title = '',
  disabled = false
}: SEOFieldsProps) {
  const [autoSlug, setAutoSlug] = React.useState(true);

  // Auto-generate slug from title
  React.useEffect(() => {
    if (autoSlug && title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      onSlugChange(generatedSlug);
    }
  }, [title, autoSlug, slug, onSlugChange]);

  const handleSlugChange = (newSlug: string) => {
    setAutoSlug(false);
    onSlugChange(newSlug);
  };

  const generateSlugFromTitle = () => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      onSlugChange(generatedSlug);
      setAutoSlug(true);
    }
  };

  const excerptWordCount = excerpt.trim().split(/\s+/).filter(word => word.length > 0).length;
  const metaDescriptionLength = metaDescription.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          SEO & Post Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Post Excerpt */}
        <div className="space-y-2">
          <label htmlFor="excerpt" className="block text-sm font-medium">
            Post Excerpt
          </label>
          <Textarea
            id="excerpt"
            placeholder="Brief summary of your post..."
            value={excerpt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onExcerptChange(e.target.value)}
            disabled={disabled}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Used in post previews and social media</span>
            <span>{excerptWordCount} words</span>
          </div>
        </div>

        {/* URL Slug */}
        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            URL Slug
          </label>
          <div className="flex gap-2">
            <Input
              id="slug"
              placeholder="post-url-slug"
              value={slug}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSlugChange(e.target.value)}
              disabled={disabled}
              className="font-mono text-sm"
            />
            <button
              type="button"
              onClick={generateSlugFromTitle}
              disabled={disabled || !title}
              className="px-3 py-2 text-xs border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate from title"
            >
              Auto
            </button>
          </div>
          {slug && (
            <div className="text-xs text-muted-foreground">
              Preview: <span className="font-mono">yoursite.com/{slug}/</span>
            </div>
          )}
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <label htmlFor="meta-description" className="block text-sm font-medium">
            Meta Description
          </label>
          <Textarea
            id="meta-description"
            placeholder="Description for search engines (150-160 characters recommended)..."
            value={metaDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onMetaDescriptionChange(e.target.value)}
            disabled={disabled}
            rows={2}
            className="resize-none"
            maxLength={200}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Appears in search engine results</span>
            <span 
              className={metaDescriptionLength > 160 ? 'text-orange-500' : metaDescriptionLength > 150 ? 'text-yellow-500' : ''}
            >
              {metaDescriptionLength}/160 characters
            </span>
          </div>
          {metaDescriptionLength > 160 && (
            <div className="text-xs text-orange-500">
              ⚠️ Description may be truncated in search results
            </div>
          )}
        </div>

        {/* SEO Tips */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-2">SEO Tips:</div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Keep excerpt between 20-40 words</li>
            <li>• Use keywords naturally in slug and meta description</li>
            <li>• Meta description should be 150-160 characters</li>
            <li>• Slug should be readable and descriptive</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
