'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface WordPressPublisherProps {
  title: string;
  content: string;
  featuredImage?: File | null;
  featuredMediaId?: number | null;
  categories?: number[];
  tags?: string[];
  excerpt?: string;
  slug?: string;
  metaDescription?: string;
  onPublishSuccess?: (result: any) => void;
  onPublishError?: (error: string) => void;
  onMediaUpload?: (mediaId: number) => void;
}

interface PublishResult {
  id: number;
  title: string;
  status: string;
  url: string;
}

export function WordPressPublisher({ 
  title, 
  content, 
  featuredImage,
  featuredMediaId,
  categories = [],
  tags = [],
  excerpt = '',
  slug = '',
  metaDescription = '',
  onPublishSuccess, 
  onPublishError,
  onMediaUpload
}: WordPressPublisherProps) {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = React.useState(false);
  const [publishResult, setPublishResult] = React.useState<PublishResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Test WordPress connection on component mount
  React.useEffect(() => {
    testConnection();
  }, []);

  // Test WordPress connection on component mount
  React.useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch('/api/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-connection' }),
      });

      const data = await response.json();
      setIsConnected(data.connected);
      
      if (!data.connected) {
        setError('Unable to connect to WordPress site');
      }
    } catch (err) {
      setIsConnected(false);
      setError('Failed to test WordPress connection');
    }
  };

  const publishToWordPress = async (status: 'draft' | 'publish' = 'draft') => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      let mediaId = featuredMediaId;

      // Upload featured image if we have one and no media ID yet
      if (featuredImage && !featuredMediaId) {
        setIsUploadingMedia(true);
        const formData = new FormData();
        formData.append('file', featuredImage);

        const mediaResponse = await fetch('/api/wordpress/media', {
          method: 'POST',
          body: formData,
        });

        const mediaData = await mediaResponse.json();

        if (mediaData.success) {
          mediaId = mediaData.media.id;
          if (mediaId) {
            onMediaUpload?.(mediaId);
          }
        } else {
          throw new Error(mediaData.error || 'Failed to upload featured image');
        }
        
        setIsUploadingMedia(false);
      }

      const response = await fetch('/api/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-post',
          postData: {
            title: title.trim(),
            content: content.trim(),
            status,
            featured_media: mediaId,
            categories: categories.length > 0 ? categories : undefined,
            tags: tags.length > 0 ? tags : undefined,
            excerpt: excerpt.trim() || undefined,
            slug: slug.trim() || undefined,
            meta: metaDescription.trim() ? { description: metaDescription.trim() } : undefined,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPublishResult(data.post);
        onPublishSuccess?.(data.post);
      } else {
        const errorMsg = data.error || 'Failed to publish to WordPress';
        setError(errorMsg);
        onPublishError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error while publishing to WordPress';
      setError(errorMsg);
      onPublishError?.(errorMsg);
    } finally {
      setIsPublishing(false);
      setIsUploadingMedia(false);
    }
  };

  if (isConnected === null) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Testing WordPress connection...
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-destructive mb-2">
          <AlertCircle className="h-4 w-4" />
          WordPress Connection Failed
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Unable to connect to your WordPress site. Please check your credentials.
        </p>
        <Button size="sm" variant="outline" onClick={testConnection}>
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="font-semibold text-sm">WordPress</span>
        <span className="text-xs text-muted-foreground">Connected</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive mb-3 p-2 bg-destructive/10 rounded">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {publishResult && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 rounded border">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 mb-2">
            <CheckCircle className="h-4 w-4" />
            Published successfully!
          </div>
          <div className="text-sm space-y-1">
            <div><strong>Title:</strong> {publishResult.title}</div>
            <div><strong>Status:</strong> {publishResult.status}</div>
            <div className="flex items-center gap-2">
              <strong>URL:</strong> 
              <a 
                href={publishResult.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                View Post <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Button
          onClick={() => publishToWordPress('draft')}
          disabled={isPublishing || isUploadingMedia || !title.trim() || !content.trim()}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {isPublishing || isUploadingMedia ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploadingMedia ? 'Uploading Image...' : 'Publishing...'}
            </>
          ) : (
            'Save as WordPress Draft'
          )}
        </Button>
        
        <Button
          onClick={() => publishToWordPress('publish')}
          disabled={isPublishing || isUploadingMedia || !title.trim() || !content.trim()}
          size="sm"
          className="w-full"
        >
          {isPublishing || isUploadingMedia ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isUploadingMedia ? 'Uploading Image...' : 'Publishing...'}
            </>
          ) : (
            'Publish to WordPress'
          )}
        </Button>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Posts will be published to: rjtreeservices.co.nz
      </div>
    </div>
  );
}
