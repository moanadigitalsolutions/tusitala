'use client';

import * as React from 'react';
import { ContentEditor } from '@/components/content-editor';
import { WordPressPublisher } from '@/components/wordpress-publisher';
import { Card } from '@/components/ui/card';

export default function ImageUploadDemoPage() {
  const [content, setContent] = React.useState('<p>Welcome to the enhanced editor with image upload capabilities!</p><p>Click the image button in the toolbar to test uploading images.</p>');
  const [title, setTitle] = React.useState('Image Upload Demo Post');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Enhanced Content Editor Demo</h1>
        <p className="text-muted-foreground">
          Test the new image upload functionality with local file support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Content Editor</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Post title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <ContentEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing your content..."
                userId="demo-user-123"
              />
            </div>
          </div>
        </Card>

        {/* WordPress Publisher Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">WordPress Publisher</h2>
          <div className="space-y-4">
            <WordPressPublisher
              title={title}
              content={content}
              userId="demo-user-123"
              onPublishSuccess={(result) => {
                console.log('Published successfully:', result);
                alert(`Post published successfully! ID: ${result.id}`);
              }}
              onPublishError={(error) => {
                console.error('Publish error:', error);
                alert(`Publish failed: ${error}`);
              }}
            />
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Image Upload Features:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Drag & drop image upload</li>
                <li>File browser selection</li>
                <li>Image library management</li>
                <li>Alt text and caption support</li>
                <li>Automatic WordPress upload on publish</li>
                <li>Local storage during editing</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">How to Test Image Upload</h3>
        <div className="space-y-2 text-sm">
          <p><strong>1. Upload an Image:</strong> Click the image button (📷) in the editor toolbar</p>
          <p><strong>2. Choose Upload Method:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Upload Tab:</strong> Drag & drop or browse for local files</li>
            <li><strong>URL Tab:</strong> Insert images from external URLs</li>
            <li><strong>Library Tab:</strong> Select from previously uploaded images</li>
          </ul>
          <p><strong>3. Add Metadata:</strong> Include alt text for accessibility and optional captions</p>
          <p><strong>4. Insert Image:</strong> The image will be added to your content</p>
          <p><strong>5. Publish to WordPress:</strong> Local images will be automatically uploaded to WordPress media library</p>
        </div>
      </Card>

      {/* Current Content Preview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">Content Preview</h3>
        <div 
          className="prose prose-sm max-w-none border rounded p-4 bg-gray-50"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Card>
    </div>
  );
}
